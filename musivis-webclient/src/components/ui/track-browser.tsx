import { SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import TrackCard from "./track-card";
import { ScrollArea, ScrollBar } from "./scroll-area";

export default function TrackBrowser({
    tracks,
    onTrackClicked,
}: {
    tracks: SpotifyTrack[];
    onTrackClicked: (track: SpotifyTrack) => void;
}) {
    return (
        <ScrollArea>
            <div className="flex space-x-4 overflow-x-auto py-4 px-2">
                {tracks.map((track) => (
                    <TrackCard
                        key={track.id}
                        track={track}
                        className="w-1/12"
                        onClick={() => onTrackClicked(track)}
                    />
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}
