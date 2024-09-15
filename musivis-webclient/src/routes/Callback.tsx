import { SpotifyAuthorization } from "@/services/spotifyAuthorization";
import { useEffect } from "react";

function Callback(){
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if(!code){
            throw new Error('Code not found');
        }

        SpotifyAuthorization.exchangeCodeForToken(code);
    }, []);
 

    return (
        <div>
            Loading...
        </div>
    )
}

export default Callback;