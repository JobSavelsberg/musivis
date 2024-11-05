import SpotifyPlayer from "@/components/ui/spotify-player";
import TrackBrowser from "@/components/ui/track-browser";
import Visualization from "@/components/ui/visualization";
import { SpotifyRepository } from "@/services/spotify/spotifyRepository";
import { PlayableTrack, SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { useEffect, useState } from "react";
import { SpotifyPlayerService } from "@/services/spotify/spotifyPlayerService";
import { useSpotifyTracksStore } from "@/stores/spotifyTracksStore";
import { useSpotifyPlayerStore } from "@/stores/spotifyPlayerStore";

function Home() {
    const { tracks, setTracks, isSearching } = useSpotifyTracksStore();
    const { currentTrack } = useSpotifyPlayerStore();
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

    const shouldShowTracks = isSearching || isPickingTrack;

    return (
        <div className="flex flex-col flex-grow">
            <div
                // Add a bit of padding to make accidentally leaving the area less likely
                className={`transition-all duration-200  ${
                    shouldShowTracks
                        ? "pb-4 max-h-48 opacity-100 visible"
                        : "max-h-0 opacity-0 collapse"
                } `}
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

            <div>
                <Visualization track={currentTrack}></Visualization>
            </div>
            <div className="flex-grow"></div>
            <SpotifyPlayer></SpotifyPlayer>
        </div>
    );
}

export default Home;
