import { AuthContext } from "@/components/auth-provider";
import { SpotifyAuthorization } from "@/services/spotify/spotifyAuthorization";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Callback() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const tryToExchangeCodeForToken = async () => {
            // We need to use localStorage here because strict mode runs this twice, without being able to use state
            // We can only ever call the token endpoint once, so we need to keep track of whether we are already logging in
            const isLoggingIn = localStorage.getItem("isLoggingIn") === "true";
            // Ensure that the login process is only started once
            if (isLoggingIn) {
                return;
            } else {
                localStorage.setItem("isLoggingIn", "true");
            }

            try {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get("code");
                if (!code) {
                    throw new Error("Code not found");
                }
                await SpotifyAuthorization.exchangeCodeForToken(code);
                login();
                navigate("/");
            } catch {
                navigate("/login");
            } finally {
                localStorage.setItem("isLoggingIn", "false");
            }
        };

        tryToExchangeCodeForToken().catch((e) => {
            console.error("Error in tryToExchangeCodeForToken", e);
        });
    }, []);

    return <div>Logging in...</div>;
}

export default Callback;
