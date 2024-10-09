// import SpotifyPlayer from "@/components/ui/spotify-player";
import SpotifyPlayer from "@/components/ui/spotify-player";
import TrackBrowser from "@/components/ui/track-browser";
import { SpotifyRepository } from "@/services/spotify/spotifyRepository";
import { SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { useEffect, useState } from "react";
import { useSpotifyPlayerStore } from "@/stores/spotifyPlayerStore";
import { SpotifyPlayerService } from "@/services/spotify/spotifyPlayerService";

function Home() {
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
    const { currentTrack } = useSpotifyPlayerStore();

    useEffect(() => {
        SpotifyRepository.getTopTracks().then((tracks) =>
            setTracks(tracks.items),
        );
    }, []);

    const onTrackClicked = (track: SpotifyTrack) => {
        // setCurrentTrack(track as PlayableTrack);
        SpotifyPlayerService.play(track.uri);
    };

    return (
        <div className="flex flex-col p-10 gap-10">
            <TrackBrowser
                tracks={tracks}
                onTrackClicked={onTrackClicked}
            ></TrackBrowser>
            <SpotifyPlayer></SpotifyPlayer>
        </div>
    );
}

export default Home;
