import SpotifyPlayer from "@/components/ui/spotify-player";
import TrackBrowser from "@/components/ui/track-browser";
import { SpotifyRepository } from "@/services/spotify/spotifyRepository";
import { PlayableTrack, SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { useEffect } from "react";
import { SpotifyPlayerService } from "@/services/spotify/spotifyPlayerService";
import { useSpotifyTracksStore } from "@/stores/spotifyTracksStore";

function Home() {
    const { tracks, setTracks } = useSpotifyTracksStore();

    useEffect(() => {
        SpotifyRepository.getTopTracks().then((tracks) =>
            setTracks(tracks.items as PlayableTrack[]),
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
