import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Slider } from "./slider";
import {
    SpotifyDeviceId,
    SpotifyPlayerState,
    SpotifyTrack,
} from "@/services/spotify/spotifyDTOs";
import { Pause, Play } from "lucide-react";
import { Spotify } from "@/services/spotify/spotify";

type SpotifyPlayer = {
    addListener: (
        event: string,
        cb: (state: SpotifyPlayerState | SpotifyDeviceId) => void,
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

export type SpotifyPlayerProps = {
    track?: SpotifyTrack;
    setTrack: (track: SpotifyTrack) => void;
};

export default function SpotifyPlayer({ track, setTrack }: SpotifyPlayerProps) {
    const [is_paused, setPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState<SpotifyPlayer | undefined>(undefined);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    // track changed
    useEffect(() => {
        if (player && track) {
            Spotify.play(track, 0);
            player.getCurrentState().then((state) => {
                if (state) {
                    player.seek(0);
                    setProgress(0);
                }
            });
        }
    }, [track, player]);

    useEffect(() => {
        // Check if the Spotify SDK is already loaded
        const loadedScript = document.querySelector(
            "script[src='https://sdk.scdn.co/spotify-player.js']",
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).Spotify || loadedScript) {
            return;
        }
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const newPlayer = new window.Spotify.Player({
                name: "Musivis",
                getOAuthToken: (cb) => {
                    const token = localStorage.getItem("access_token");
                    cb(token || "");
                },
                volume: 0.5,
            });

            setPlayer(newPlayer);

            newPlayer.addListener("ready", (ready) => {
                Spotify.transferPlaybackToDevice(
                    (ready as SpotifyDeviceId).device_id,
                );
            });

            newPlayer.addListener("not_ready", (not_ready) => {
                console.warn("Device ID has gone offline", not_ready);
            });

            newPlayer.addListener(
                "player_state_changed",
                (player_state_changed) => {
                    const state = player_state_changed as SpotifyPlayerState;
                    if (!state) {
                        return;
                    }

                    if (track?.id !== state.track_window.current_track.id) {
                        setTrack(state.track_window.current_track);
                    }

                    // props.track = state.track_window.current_track;
                    setPaused(state.paused);
                    setProgress(state.position);

                    newPlayer.getCurrentState().then((state) => {
                        if (!state) {
                            setActive(false);
                        } else {
                            setActive(true);
                        }
                    });
                },
            );

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
                    Math.min(prev + 1000, track?.duration_ms || 0),
                );
            }, 1000);
        }

        return () => {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [is_paused, is_active, track]);

    const handlePlayPause = () => {
        player?.togglePlay();
    };

    const handleSeek = (value: number[]) => {
        player?.seek(value[0]);
        setProgress(value[0]);
    };

    return (
        <div>
            <div className="flex items-center mb-4">
                {track?.album.images[0].url && (
                    <img
                        src={track.album.images[0].url}
                        className="w-16 h-16 mr-4"
                        alt="Now playing"
                    />
                )}
                <div>
                    <div className="font-bold">{track?.name}</div>
                    <div className="text-sm text-zinc-400">
                        {track?.artists[0].name}
                    </div>
                </div>
            </div>
            <Slider
                value={[progress]}
                max={track?.duration_ms || 100}
                step={1000}
                className="mb-4"
                onValueChange={handleSeek}
            />
            <div className="flex justify-between text-sm mb-4">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(track?.duration_ms || 0)}</span>
            </div>
            <Button onClick={handlePlayPause}>
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

function formatTime(ms: number): string {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
