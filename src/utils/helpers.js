// ---------------------------------------------------------------------------
// cn — Utility: compose class names
// Lightweight alternative to clsx/classnames with no dependencies.
// ---------------------------------------------------------------------------

/**
 * Joins class name strings, filtering out falsy values.
 * @param  {...(string|boolean|undefined|null)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// ---------------------------------------------------------------------------
// Easing functions — useful for manual animation math
// ---------------------------------------------------------------------------

/** Ease out cubic */
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

/** Ease in out cubic */
export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/** Linear interpolation */
export const lerp = (a, b, t) => a + (b - a) * t

/** Clamp value between min and max */
export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/** Map a value from one range to another */
export const mapRange = (value, inMin, inMax, outMin, outMax) =>
  ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin

// ---------------------------------------------------------------------------
// Device / performance utilities
// ---------------------------------------------------------------------------

/** Returns true if the device is likely a low-power/mobile device */
export function isLowEndDevice() {
  if (typeof navigator === 'undefined') return false
  const concurrency = navigator.hardwareConcurrency ?? 4
  return concurrency <= 4
}

/** Returns a safe particle count based on device capability */
export function safeParticleCount(desired) {
  if (isLowEndDevice()) return Math.floor(desired * 0.4)
  return desired
}

// ---------------------------------------------------------------------------
// 3D / Three.js math helpers
// ---------------------------------------------------------------------------

/**
 * Converts screen mouse position to Three.js NDC [-1, 1]
 * @param {number} x — screen X (0-1)
 * @param {number} y — screen Y (0-1)
 */
export function screenToNDC(x, y) {
  return { x: x * 2 - 1, y: -(y * 2 - 1) }
}
