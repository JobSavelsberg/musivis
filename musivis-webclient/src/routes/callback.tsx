import { SpotifyAuthorization } from "@/services/spotify/spotifyAuthorization";
import { useEffect } from "react";

function Callback() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (!code) {
            throw new Error("Code not found");
        }

        try {
            SpotifyAuthorization.exchangeCodeForToken(code);
        } catch {
            window.location.href = "/login";
        }
    }, []);

    return <div>Logging in...</div>;
}

export default Callback;
