// import SpotifyPlayer from "@/components/ui/spotify-player";
import SpotifyPlayer from "@/components/ui/spotify-player";
import TrackBrowser from "@/components/ui/track-browser";
import { SpotifyRepository } from "@/services/spotify/spotifyRepository";
import { SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { useEffect, useState } from "react";
import { SpotifyPlayerService } from "@/services/spotify/spotifyPlayerService";

function Home() {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);

    useEffect(() => {
        SpotifyRepository.getTopTracks().then((tracks) =>
            setTracks(tracks.items),
        );
    }, []);

    const onTrackClicked = (track: SpotifyTrack) => {
        SpotifyPlayerService.play(track.uri);
    };

    return (
        <div className="flex-grow flex flex-col gap-10">
            <TrackBrowser
                tracks={tracks}
                onTrackClicked={onTrackClicked}
            ></TrackBrowser>
            {/* Grow */}
            <div className="flex-grow"></div>
            <SpotifyPlayer></SpotifyPlayer>
        </div>
    );
}

export default Home;
