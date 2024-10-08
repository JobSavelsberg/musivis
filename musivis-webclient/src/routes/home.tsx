// import SpotifyPlayer from "@/components/ui/spotify-player";
import SpotifyPlayer from "@/components/ui/spotify-player";
import TrackBrowser from "@/components/ui/track-browser";
import { SpotifyRepository } from "@/services/spotify/spotifyRepository";
import { SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { useEffect, useState } from "react";

function Home() {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<
        SpotifyTrack | undefined
    >(undefined);

    useEffect(() => {
        SpotifyRepository.getTopTracks().then((tracks) =>
            setTracks(tracks.items),
        );
    }, []);

    return (
        <div className="flex flex-col p-10 gap-10">
            <TrackBrowser
                tracks={tracks}
                onTrackClicked={setSelectedTrack}
            ></TrackBrowser>
            <SpotifyPlayer track={selectedTrack} progress={0}></SpotifyPlayer>
        </div>
    );
}

export default Home;
