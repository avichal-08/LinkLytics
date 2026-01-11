import crypto from "crypto";

export function generateVisitorHash(ip: string, userAgent: string) {
  const hashString = `${ip}-${userAgent}`;
  return crypto.createHash("sha256").update(hashString).digest("hex").substring(0, 16);
}