import { useEffect, useState } from "react";
import { Button } from "./button";
import { Slider } from "./slider";
import { Pause, Play } from "lucide-react";
import { SpotifyPlayerService } from "@/services/spotify/spotifyPlayerService";
import { useSpotifyPlayerStore } from "@/stores/spotifyPlayerStore";

export default function SpotifyPlayer() {
    const { isReady, isPlaying, currentTrack, position } =
        useSpotifyPlayerStore();
    // Used to make the play/pause button more responsive
    const [requestedPlayingState, setRequestedPlayingState] = useState<
        boolean | null
    >(null);

    const showPlaying =
        requestedPlayingState !== null ? requestedPlayingState : isPlaying;

    useEffect(() => {
        if (!SpotifyPlayerService.isScriptAdded()) {
            SpotifyPlayerService.addScript();
        }
    }, []);

    function handleSeek(value: number[]) {
        SpotifyPlayerService.seek(value[0]);
    }

    function handlePlayPause() {
        if (showPlaying) {
            setRequestedPlayingState(false);
            SpotifyPlayerService.pause().then(() => {
                setRequestedPlayingState(null);
            });
        } else {
            setRequestedPlayingState(true);
            SpotifyPlayerService.play().then(() => {
                setRequestedPlayingState(null);
            });
        }
    }

    if (!isReady) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <div className="flex items-center mb-4">
                    {currentTrack?.album.images[0].url && (
                        <img
                            src={currentTrack.album.images[0].url}
                            className="w-16 h-16 mr-4"
                            alt="Now playing"
                        />
                    )}
                    <div>
                        <div className="font-bold">{currentTrack?.name}</div>
                        <div className="text-sm text-zinc-400">
                            {currentTrack?.artists[0].name}
                        </div>
                    </div>
                </div>
                <Slider
                    value={[position]}
                    max={currentTrack?.duration_ms || 1000}
                    step={200}
                    className="mb-4"
                    onValueChange={handleSeek}
                />
                <div className="flex justify-between text-sm mb-4">
                    <span>{formatTime(position)}</span>
                    <span>{formatTime(currentTrack?.duration_ms || 0)}</span>
                </div>
                <Button onClick={handlePlayPause}>
                    {showPlaying ? (
                        <Pause className="mr-2" />
                    ) : (
                        <Play className="mr-2" />
                    )}
                    {showPlaying ? "PAUSE" : "PLAY"}
                </Button>
            </div>
        );
    }
}

function formatTime(ms: number): string {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
