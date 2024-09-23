import TrackBrowser from "@/components/ui/track-browser";
import { Spotify } from "@/services/spotify/spotify";
import { SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { useEffect, useState } from "react";


function Home() {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);

    useEffect(() => {
        Spotify.getTopTracks().then(tracks => setTracks(tracks.items));
    }, []);

    return(
        <>
            <TrackBrowser tracks={tracks}></TrackBrowser>
        </>
    )
}

export default Home;