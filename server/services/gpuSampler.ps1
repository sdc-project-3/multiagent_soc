[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# -----------------------------------------------------------------------------
# SentinelX Windows GPU Performance Counter Sampler
# Queries Windows GPU Engine & GPU Adapter Memory performance counters
# and correlates them with physical GPUs via DXGI.
# -----------------------------------------------------------------------------

$dxgiCode = @"
using System;
using System.Runtime.InteropServices;
using System.Collections.Generic;

public class DxgiAdapterInfo {
    [DllImport("dxgi.dll")]
    private static extern int CreateDXGIFactory1(ref Guid riid, out IntPtr ppFactory);

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct DXGI_ADAPTER_DESC1 {
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 128)]
        public string Description;
        public uint VendorId;
        public uint DeviceId;
        public uint SubSysId;
        public uint Revision;
        public UIntPtr DedicatedVideoMemory;
        public UIntPtr DedicatedSystemMemory;
        public UIntPtr SharedSystemMemory;
        public uint LuidLowPart;
        public int LuidHighPart;
        public uint Flags;
    }

    [ComImport]
    [Guid("770aae78-f26f-4dba-a829-253c83d1b387")]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    private interface IDXGIFactory1 {
        int SetPrivateData();
        int SetPrivateDataInterface();
        int GetPrivateData();
        int GetParent();
        int EnumAdapters();
        int MakeWindowAssociation();
        int GetWindowAssociation();
        int CreateSwapChain();
        int CreateSoftwareAdapter();
        [PreserveSig]
        int EnumAdapters1(uint Adapter, out IntPtr ppAdapter);
        int IsCurrent();
    }

    [ComImport]
    [Guid("29038f61-3839-4626-91fd-086879011a05")]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    private interface IDXGIAdapter1 {
        int SetPrivateData();
        int SetPrivateDataInterface();
        int GetPrivateData();
        int GetParent();
        int EnumOutputs();
        int GetDesc();
        int CheckInterfaceSupport();
        [PreserveSig]
        int GetDesc1(out DXGI_ADAPTER_DESC1 pDesc);
    }

    public static string GetAdaptersJson() {
        try {
            Guid IID_IDXGIFactory1 = new Guid("770aae78-f26f-4dba-a829-253c83d1b387");
            IntPtr factoryPtr;
            int hr = CreateDXGIFactory1(ref IID_IDXGIFactory1, out factoryPtr);
            if (hr != 0) return "[]";

            IDXGIFactory1 factory = (IDXGIFactory1)Marshal.GetObjectForIUnknown(factoryPtr);
            var list = new List<string>();

            uint i = 0;
            while (true) {
                IntPtr adapterPtr;
                hr = factory.EnumAdapters1(i, out adapterPtr);
                if (hr != 0 || adapterPtr == IntPtr.Zero) break;

                IDXGIAdapter1 adapter = (IDXGIAdapter1)Marshal.GetObjectForIUnknown(adapterPtr);
                DXGI_ADAPTER_DESC1 desc;
                adapter.GetDesc1(out desc);

                if ((desc.Flags & 2) == 0 && !desc.Description.Contains("Basic Render") && !desc.Description.Contains("Microsoft Remote")) {
                    string luidStr = string.Format("0x{0:x8}_0x{1:x8}", desc.LuidHighPart, desc.LuidLowPart).ToLower();
                    string json = string.Format("{{\"name\":\"{0}\",\"vendorId\":{1},\"deviceId\":{2},\"luid\":\"{3}\",\"dedicatedMemMB\":{4},\"sharedMemMB\":{5}}}",
                        desc.Description.Replace("\\", "\\\\").Replace("\"", "\\\""),
                        desc.VendorId,
                        desc.DeviceId,
                        luidStr,
                        (ulong)desc.DedicatedVideoMemory / (1024 * 1024),
                        (ulong)desc.SharedSystemMemory / (1024 * 1024)
                    );
                    list.Add(json);
                }
                Marshal.Release(adapterPtr);
                i++;
            }
            Marshal.Release(factoryPtr);
            return "[" + string.Join(",", list) + "]";
        } catch {
            return "[]";
        }
    }
}
"@

try {
    Add-Type -TypeDefinition $dxgiCode -ErrorAction SilentlyContinue
} catch {}

function Get-DxgiAdapters {
    try {
        $json = [DxgiAdapterInfo]::GetAdaptersJson()
        if ($json) {
            return ConvertFrom-Json $json
        }
    } catch {}
    return @()
}

$adapterMap = @{}
try {
    $adapters = Get-DxgiAdapters
    foreach ($a in $adapters) {
        if ($a.luid) {
            $adapterMap[$a.luid] = $a
        }
    }
} catch {}

$counterPaths = @(
    '\GPU Engine(*)\Utilization Percentage',
    '\GPU Adapter Memory(*)\Dedicated Usage',
    '\GPU Adapter Memory(*)\Shared Usage'
)

# Continuous sampling loop
try {
    Get-Counter -Counter $counterPaths -SampleInterval 1 -Continuous | ForEach-Object {
        $sampleSet = $_
        $luidData = @{}

        # Refresh adapters if empty
        if ($adapterMap.Count -eq 0) {
            try {
                $adapters = Get-DxgiAdapters
                foreach ($a in $adapters) {
                    if ($a.luid) { $adapterMap[$a.luid] = $a }
                }
            } catch {}
        }

        foreach ($sample in $sampleSet.CounterSamples) {
            $path = $sample.Path.ToLower()
            $inst = $sample.InstanceName.ToLower()
            $val = $sample.CookedValue

            if ($inst -match 'luid_(0x[0-9a-f]+_0x[0-9a-f]+)') {
                $luid = $matches[1]
                if (-not $luidData.ContainsKey($luid)) {
                    $luidData[$luid] = @{
                        threeD = 0.0
                        copy = 0.0
                        videoDecode = 0.0
                        videoProcessing = 0.0
                        dedicatedBytes = 0.0
                        sharedBytes = 0.0
                    }
                }

                if ($path -like '*gpu engine*') {
                    if ($inst -match 'engtype_3d') {
                        $luidData[$luid].threeD += $val
                    } elseif ($inst -match 'engtype_copy') {
                        $luidData[$luid].copy += $val
                    } elseif ($inst -match 'engtype_videodecode' -or $inst -match 'engtype_decode') {
                        $luidData[$luid].videoDecode += $val
                    } elseif ($inst -match 'engtype_videoprocessing' -or $inst -match 'engtype_processing') {
                        $luidData[$luid].videoProcessing += $val
                    }
                } elseif ($path -like '*gpu adapter memory*') {
                    if ($path -like '*dedicated usage*') {
                        $luidData[$luid].dedicatedBytes = $val
                    } elseif ($path -like '*shared usage*') {
                        $luidData[$luid].sharedBytes = $val
                    }
                }
            }
        }

        $outAdapters = @()
        foreach ($luid in $luidData.Keys) {
            $d = $luidData[$luid]
            $adapterInfo = $adapterMap[$luid]
            $name = if ($adapterInfo) { $adapterInfo.name } else { "GPU ($luid)" }
            $vendorId = if ($adapterInfo) { $adapterInfo.vendorId } else { 0 }

            $outAdapters += @{
                luid = $luid
                name = $name
                vendorId = $vendorId
                threeD = [Math]::Round([Math]::Min(100.0, [Math]::Max(0.0, $d.threeD)), 1)
                copy = [Math]::Round([Math]::Min(100.0, [Math]::Max(0.0, $d.copy)), 1)
                videoDecode = [Math]::Round([Math]::Min(100.0, [Math]::Max(0.0, $d.videoDecode)), 1)
                videoProcessing = [Math]::Round([Math]::Min(100.0, [Math]::Max(0.0, $d.videoProcessing)), 1)
                dedicatedMB = [Math]::Round(($d.dedicatedBytes / 1048576.0), 1)
                sharedMB = [Math]::Round(($d.sharedBytes / 1048576.0), 1)
            }
        }

        $result = @{
            timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
            adapters = $outAdapters
        }

        $jsonOut = ConvertTo-Json -Compress $result
        [Console]::WriteLine($jsonOut)
        [Console]::Out.Flush()
    }
} catch {
    [Console]::Error.WriteLine($_)
}
