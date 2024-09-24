// import SpotifyPlayer from "@/components/ui/spotify-player";
import TrackBrowser from "@/components/ui/track-browser";
import { Spotify } from "@/services/spotify/spotify";
import { SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { useEffect, useState } from "react";

function Home() {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<
        SpotifyTrack | undefined
    >(undefined);

    useEffect(() => {
        Spotify.getTopTracks().then((tracks) => setTracks(tracks.items));
    }, []);

    return (
        <>
            <TrackBrowser
                tracks={tracks}
                onTrackClicked={setSelectedTrack}
            ></TrackBrowser>
            <h1>
                {selectedTrack
                    ? `Selected track: ${selectedTrack.name}`
                    : "No track selected"}
            </h1>
            {/* <SpotifyPlayer track={selectedTrack}></SpotifyPlayer> */}
        </>
    );
}

export default Home;
