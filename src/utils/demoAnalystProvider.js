/**
 * Demo Analyst Response Provider
 * 
 * ARCHITECTURAL SEPARATION:
 * This module isolates all demo security analyst response data and query logic.
 * When integrating with a real AI backend or Gemini API in the future,
 * simply swap `queryAnalystDemo` with `realAIAnalystResponse` without modifying UI components.
 */

export const DEMO_INCIDENT = {
  id: 'INC-7742',
  endpoint: 'WS-042',
  severity: 'CRITICAL',
  event: 'Unusual outbound network activity',
  detection: 'Behavioral anomaly (Outbound Entropy > 4.8 Sigma)',
  timestamp: '14:22:08 UTC',
  sourceIp: '192.168.1.142',
  destIp: '198.51.100.24:443',
  processName: 'svchost_updater.exe',
  parentProcess: 'powershell.exe',
  isSimulation: true,
}

export const DEMO_PROMPTS = [
  {
    id: 'explain-threat',
    label: 'Explain the threat',
    question: 'Why was endpoint WS-042 flagged by the intelligence engine?',
    summary: 'Potential Command & Control (C2) communication beacon.',
    analysis:
      'WS-042 is exhibiting abnormal outbound traffic compared with its established 30-day behavioral baseline. The telemetry shows recurring encrypted HTTPS beacons at fixed 45-second intervals to an unclassified external IP (198.51.100.24). The parent process hierarchy suggests possible credential extraction and staged persistence.',
    riskLevel: 'CRITICAL',
    confidence: 'HIGH (SIMULATED)',
    threatType: 'SUSPICIOUS C2 BEACONING',
    recommendedAction: 'ISOLATE ENDPOINT',
    indicators: ['45s Beacon Periodicity', 'Unclassified ASN', 'PowerShell Spawned Executable'],
  },
  {
    id: 'root-cause',
    label: 'What caused the alert?',
    question: 'What was the initial trigger event and execution vector?',
    summary: 'Suspicious PowerShell execution spawning unverified child binary.',
    analysis:
      'The initial trigger was an anomalous PowerShell invocation at 14:21:52 UTC utilizing encoded script arguments. Within 16 seconds, this script spawned svchost_updater.exe from a non-standard directory (%APPDATA%\\Local\\Temp) which initiated encrypted outbound handshakes.',
    riskLevel: 'HIGH',
    confidence: 'HIGH (SIMULATED)',
    threatType: 'PROCESS INJECTION & LATERAL PREP',
    recommendedAction: 'QUARANTINE PROCESS & REVOKE CREDENTIALS',
    indicators: ['Encoded CLI Arguments', 'Non-Standard Temp Execution', 'LSASS Handle Access'],
  },
  {
    id: 'next-steps',
    label: 'What should I investigate next?',
    question: 'What forensic pivot points should the SOC team prioritize?',
    summary: 'Correlate Kerberos ticket requests and check peer workstations for lateral probes.',
    analysis:
      '1. Review active Kerberos TGS requests from the service account logged into WS-042 during the past 2 hours.\n2. Inspect network perimeter NetFlow for secondary outbound streams matching 198.51.100.0/24.\n3. Verify memory dump integrity on WS-042 for injected DLL handles before host reset.',
    riskLevel: 'ELEVATED',
    confidence: 'HIGH (SIMULATED)',
    threatType: 'FORENSIC INVESTIGATION PATH',
    recommendedAction: 'COMMENCE INCIDENT PLAYBOOK #42',
    indicators: ['Kerberos TGS Audit', 'Perimeter Flow Scope', 'Host Memory Snapshot'],
  },
  {
    id: 'recommend-action',
    label: 'Recommend a response',
    question: 'What automated and manual containment actions are advised?',
    summary: 'Execute immediate network micro-segmentation and token invalidation.',
    analysis:
      'Immediate Recommended Mitigation:\n1. [ACTIONABLE] Isolate WS-042 to Quarantine VLAN 99 to sever active beacon connections.\n2. Revoke active OAuth and Kerberos session tokens associated with active user sessions on this host.\n3. Deploy firewall block rule across all edge gateways for IP 198.51.100.24.',
    riskLevel: 'CRITICAL',
    confidence: 'HIGH (SIMULATED)',
    threatType: 'CONTAINMENT PROTOCOL',
    recommendedAction: 'ISOLATE ENDPOINT NOW',
    indicators: ['Host Micro-Isolation', 'Session Token Purge', 'Edge Gateway Invalidation'],
  },
]

/**
 * Simulates querying the AI Security Analyst asynchronously.
 * Replace with real backend / Gemini API call when ready.
 * 
 * @param {string} promptId - The ID of the prompt to query
 * @returns {Promise<object>} The analyst response payload
 */
export async function queryAnalystDemo(promptId) {
  // Simulate network latency (600ms)
  await new Promise((resolve) => setTimeout(resolve, 600))
  
  const found = DEMO_PROMPTS.find((p) => p.id === promptId)
  return found || DEMO_PROMPTS[0]
}
