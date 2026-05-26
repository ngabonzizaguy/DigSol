export function parseUserAgent(ua: string | null): {
  device_type: "mobile" | "tablet" | "desktop" | "unknown";
  browser: string;
  os: string;
} {
  if (!ua) return { device_type: "unknown", browser: "unknown", os: "unknown" };
  const lower = ua.toLowerCase();
  let device_type: "mobile" | "tablet" | "desktop" | "unknown" = "desktop";
  if (/ipad|tablet|playbook|silk/i.test(ua)) device_type = "tablet";
  else if (/mobile|iphone|ipod|android.*mobile|windows phone/i.test(ua)) device_type = "mobile";

  let browser = "other";
  if (lower.includes("edg/")) browser = "Edge";
  else if (lower.includes("chrome/") && !lower.includes("edg/")) browser = "Chrome";
  else if (lower.includes("firefox/")) browser = "Firefox";
  else if (lower.includes("safari/") && !lower.includes("chrome/")) browser = "Safari";

  let os = "other";
  if (lower.includes("windows")) os = "Windows";
  else if (lower.includes("mac os")) os = "macOS";
  else if (lower.includes("android")) os = "Android";
  else if (lower.includes("iphone") || lower.includes("ipad")) os = "iOS";
  else if (lower.includes("linux")) os = "Linux";

  return { device_type, browser, os };
}
