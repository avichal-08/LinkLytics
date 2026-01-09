const blocked = ["file:", "data:", "javascript:"];
const allowed = ["http:", "https:"];
export function isValidUrl(input: string): boolean {
    try {
        const url = new URL(input);

        if (blocked.includes(url.protocol)) return false;
        return ["http:", "https:"].includes(url.protocol);
    } catch {
        return false;
    }
}
