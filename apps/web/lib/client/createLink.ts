import type { CreateLinkResponse } from "../../lib/types/createLinkResponse"
import { isValidUrl } from "../utils/isValidUrl";

export default async function createLink(url: string): Promise<CreateLinkResponse> {
    const isUrlValid = isValidUrl(url);
    if (!isUrlValid) {
        return {
            success: false,
            message: "Invalid Url"
        }
    }
    try {
        const res = await fetch("/api/create", {
            method: "POST",
            body: JSON.stringify({ url }),
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        return data;
    } catch (error) {
        return {
            success: false,
            message: "Please try agian later"
        };
    }
}