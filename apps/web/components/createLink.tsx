"use client"

import { useRef, useState } from "react";
import createLink from "../lib/client/createLink";

export default function CreateLink() {
    const urlRef = useRef<null | HTMLInputElement>(null);
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const clickHandler = async () => {
        const value = urlRef.current?.value.trim();
        if (!value)
            return;
        const payload = await createLink(value);
        if (payload.success) {
            setRedirectUrl(payload.redirectUrl);
            setError(null)
        }
        else {
            setError(payload.message);
            setRedirectUrl(null);
        }
    }

    return (
        <div>
            <input type='text' ref={urlRef} />
            <button onClick={() => clickHandler()}>Get Redirect Url</button>
            {redirectUrl &&
                <div className="text-white ">
                    Redirect Url: {redirectUrl}
                </div>
            }
            {error &&
                <div className="text-white">
                    Error:{error}
                </div>}
        </div>
    )
}