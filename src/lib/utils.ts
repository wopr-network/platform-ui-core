import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validate a redirect URL is a safe relative path.
 * Accepts paths starting with "/" but rejects protocol-relative URLs like "//evil.com".
 * Also rejects percent-encoded variants (e.g. "/%2F%2Fevil.com") that decode to "//".
 * Falls back to "/" for any unsafe value.
 */
export function sanitizeRedirectUrl(raw: string | null | undefined): string {
  if (!raw?.startsWith("/")) {
    return "/";
  }

  // Decode percent-encoding to catch bypass attempts like /%2F%2Fevil.com.
  // Loop because double-encoding is possible (/%252F → /%2F → //).
  let decoded = raw;
  try {
    let prev = decoded;
    decoded = decodeURIComponent(decoded);
    // Iteratively decode until stable (handles double/triple encoding)
    while (decoded !== prev) {
      prev = decoded;
      decoded = decodeURIComponent(decoded);
    }
  } catch {
    // Malformed percent-encoding — reject
    return "/";
  }

  if (decoded.startsWith("//")) {
    return "/";
  }

  return raw;
}
