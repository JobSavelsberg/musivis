import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Slider } from "./slider";
import { SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { Pause, Play } from "lucide-react";

type SpotifyPlayerState = {
    track_window: {
        current_track: SpotifyTrack;
    };
    paused: boolean;
    device_id: string;
};

type SpotifyPlayer = {
    addListener: (
        event: string,
        cb: (state: SpotifyPlayerState) => void,
    ) => void;
    connect: () => void;
    getCurrentState: () => Promise<SpotifyPlayerState | undefined>;
    togglePlay: () => void;
    seek: (position: number) => void;
};

declare global {
    interface Window {
        Spotify: {
            Player: new (options: {
                name: string;
                getOAuthToken: (cb: (token: string) => void) => void;
                volume: number;
            }) => SpotifyPlayer;
        };
        onSpotifyWebPlaybackSDKReady: () => void;
    }
}

export default function SpotifyPlayer({ track }: { track?: SpotifyTrack }) {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState<SpotifyPlayer | undefined>(undefined);
    const [progress, setProgress] = useState(0);
    const [current_track, setTrack] = useState<SpotifyTrack | undefined>(track);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check if the Spotify SDK is already loaded
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).Spotify) {
            return;
        }
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            if (player !== undefined) {
                return;
            }

            const newPlayer = new window.Spotify.Player({
                name: "Web Playback SDK",
                getOAuthToken: (cb) => {
                    cb(localStorage.getItem("access_token") || "");
                },
                volume: 0.5,
            });

            setPlayer(newPlayer);

            newPlayer.addListener("ready", ({ device_id }) => {
                console.log("Ready with Device ID", device_id);
            });

            newPlayer.addListener("not_ready", ({ device_id }) => {
                console.log("Device ID has gone offline", device_id);
            });

            newPlayer.addListener("player_state_changed", (state) => {
                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                newPlayer.getCurrentState().then((state) => {
                    if (!state) {
                        setActive(false);
                    } else {
                        setActive(true);
                    }
                });
            });

            newPlayer.connect();
        };
    }, []);

    useEffect(() => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }

        if (!is_paused && is_active) {
            progressInterval.current = setInterval(() => {
                setProgress((prev) =>
                    Math.min(prev + 1000, current_track?.duration_ms || 0),
                );
            }, 1000);
        }

        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [is_paused, is_active, current_track]);

    const handlePlayPause = () => {
        player?.togglePlay();
    };

    const handleSeek = (value: number[]) => {
        player?.seek(value[0]);
        setProgress(value[0]);
    };

    if (!is_active) {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b>
                            {" "}
                            Instance not active. Transfer your playback using
                            your Spotify app{" "}
                        </b>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <div className="p-4 bg-zinc-900 text-white rounded-lg max-w-md mx-auto">
                <div className="flex items-center mb-4">
                    {current_track?.album.images[0].url && (
                        <img
                            src={current_track.album.images[0].url}
                            className="w-16 h-16 mr-4"
                            alt="Now playing"
                        />
                    )}
                    <div>
                        <div className="font-bold">{current_track?.name}</div>
                        <div className="text-sm text-zinc-400">
                            {current_track?.artists[0].name}
                        </div>
                    </div>
                </div>
                <Slider
                    value={[progress]}
                    max={current_track?.duration_ms || 100}
                    step={1000}
                    className="mb-4"
                    onValueChange={handleSeek}
                />
                <div className="flex justify-between text-sm mb-4">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(current_track?.duration_ms || 0)}</span>
                </div>
                <Button
                    onClick={handlePlayPause}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                    {is_paused ? (
                        <Play className="mr-2" />
                    ) : (
                        <Pause className="mr-2" />
                    )}
                    {is_paused ? "PLAY" : "PAUSE"}
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
