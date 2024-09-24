import { SpotifyLoginForm } from "@/components/ui/spotify-login-form";
import { SpotifyAuthorization } from "@/services/spotify/spotifyAuthorization";
import { useEffect } from "react";

function Login() {
    // Ensure user is logged out first
    useEffect(() => {
        SpotifyAuthorization.logOut();
    }, []);

    return <SpotifyLoginForm></SpotifyLoginForm>;
}

export default Login;
