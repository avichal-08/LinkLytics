import { nanoid } from "nanoid";
import slugExists from "./slugExists";

export default async function slug() {
    let slug: string;

    do {
        slug = nanoid(7);
    } while (await slugExists(slug));
    return slug;
}