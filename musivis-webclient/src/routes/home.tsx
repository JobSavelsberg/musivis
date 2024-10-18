import SpotifyPlayer from "@/components/ui/spotify-player";
import TrackBrowser from "@/components/ui/track-browser";
import { SpotifyRepository } from "@/services/spotify/spotifyRepository";
import { PlayableTrack, SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { useEffect, useState } from "react";
import { SpotifyPlayerService } from "@/services/spotify/spotifyPlayerService";
import { useSpotifyTracksStore } from "@/stores/spotifyTracksStore";

function Home() {
    const { tracks, setTracks, isSearching } = useSpotifyTracksStore();
    const [isPickingTrack, setIsPickingTrack] = useState(true);

    useEffect(() => {
        SpotifyRepository.getTopTracks().then((tracks) =>
            setTracks(tracks.items as PlayableTrack[]),
        );
    }, []);

    const onTrackClicked = (track: SpotifyTrack) => {
        SpotifyPlayerService.play(track.uri);
        setIsPickingTrack(false);
    };

    const showTracks = isSearching || isPickingTrack;
    return (
        <div className="flex-grow flex flex-col gap-10">
            <div
                // Add a bit of padding to make accidentally leaving the area less likely
                className={`transition-opacity duration-200 pb-4 ${
                    showTracks ? "opacity-100" : "opacity-0"
                }`}
                onMouseEnter={() => {
                    // Only trigger after a search, not any random hover
                    if (isSearching) {
                        setIsPickingTrack(true);
                    }
                }}
                onMouseLeave={() => setIsPickingTrack(false)}
                // make sure that if it's in focus, we are picking a track
                onFocus={() => setIsPickingTrack(true)}
            >
                <TrackBrowser
                    tracks={tracks}
                    onTrackClicked={onTrackClicked}
                ></TrackBrowser>
            </div>
            {/* Grow */}
            <div className="flex-grow"></div>
            <SpotifyPlayer></SpotifyPlayer>
        </div>
    );
}

export default Home;
