import { UAParser } from "ua-parser-js";

export function parseUserAgent(userAgent: string) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  return {
    deviceType: result.device.type || "desktop",
    os: result.os.name || "Unknown",
    browser: result.browser.name || "Unknown",
  };
}