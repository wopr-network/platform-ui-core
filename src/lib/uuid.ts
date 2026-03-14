/**
 * Generate a v4 UUID that works in all contexts.
 *
 * crypto.randomUUID() requires a secure context (HTTPS or localhost).
 * On HTTP with a non-localhost domain (e.g. local dev via /etc/hosts),
 * it throws. This utility falls back to crypto.getRandomValues() which
 * works everywhere, including non-secure contexts.
 */
export function uuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback: build a v4 UUID from getRandomValues (works in non-secure contexts)
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  // Set version (4) and variant (RFC 4122)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
