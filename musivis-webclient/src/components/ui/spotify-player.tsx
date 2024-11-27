import { useEffect, useState } from "react";
import { Button } from "./button";
import { Pause, Play, Loader2, MonitorSpeaker } from "lucide-react"; // Import Loader icon
import { SpotifyPlayerService } from "@/services/spotify/spotifyPlayerService";
import { useSpotifyPlayerStore } from "@/stores/spotifyPlayerStore";
import { Seeker } from "./seeker";
import { Skeleton } from "./skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu";

export default function SpotifyPlayer() {
    const {
        availableDevices,
        activeDevice,
        isReady,
        isPlaying,
        currentTrack,
        position,
    } = useSpotifyPlayerStore();
    // Used to make the play/pause button more responsive
    const [requestedPlayingState, setRequestedPlayingState] = useState<
        boolean | null
    >(null);

    const showPlaying =
        requestedPlayingState !== null ? requestedPlayingState : isPlaying;

    useEffect(() => {
        if (!SpotifyPlayerService.isScriptAdded) {
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

    function setActiveDeviceById(deviceId: string): void {
        const availableDevice = availableDevices.find(
            (device) => device.id === deviceId,
        );
        if (!availableDevice) {
            return;
        }
        SpotifyPlayerService.transferPlaybackToDevice(availableDevice);
    }

    const lookForDevices = () => {
        SpotifyPlayerService.updateAvailableDevices();
    };

    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center">
                    {isReady ? (
                        <>
                            {currentTrack?.album.images[0].url && (
                                <img
                                    src={currentTrack.album.images[0].url}
                                    className="w-16 h-16 mr-4"
                                    alt="Now playing"
                                />
                            )}
                            <div>
                                <div className="font-bold">
                                    {currentTrack?.name}
                                </div>
                                <div className="text-sm text-zinc-400">
                                    {currentTrack?.artists[0].name}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Skeleton className="w-16 h-16 mr-4" />
                            <div>
                                <Skeleton className="w-32 h-5 mb-2" />
                                <Skeleton className="w-24 h-4" />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-end justify-center">
                    <div className="h-10 w-10 flex items-center justify-center">
                        {isReady ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePlayPause}
                                className="w-full h-full rounded-full"
                            >
                                {showPlaying ? <Pause /> : <Play />}
                            </Button>
                        ) : (
                            <Loader2 className="w-full h-full animate-spin text-muted" />
                        )}
                    </div>
                </div>

                <div className="flex items-end justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            asChild
                            onPointerDown={lookForDevices}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-10 h-10 rounded-full relative group"
                            >
                                <MonitorSpeaker />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mr-5">
                            <DropdownMenuLabel>
                                Current Device
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={activeDevice?.id ?? ""}
                                onValueChange={setActiveDeviceById}
                            >
                                {availableDevices.map((device) => (
                                    <DropdownMenuRadioItem
                                        value={device.id}
                                        key={device.id}
                                        className={
                                            device.name !==
                                            SpotifyPlayerService.LOCAL_PLAYER_NAME
                                                ? "text-muted-foreground"
                                                : ""
                                        }
                                    >
                                        {device.name}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="flex items-center text-sm gap-4 h-12">
                {isReady ? (
                    <>
                        <span className="w-7">{formatTime(position)}</span>
                        <Seeker
                            className="h-12"
                            value={[position]}
                            max={currentTrack?.duration_ms || 1000}
                            step={200}
                            onValueChange={handleSeek}
                        />
                        <span className="w-7">
                            {formatTime(currentTrack?.duration_ms || 0)}
                        </span>
                    </>
                ) : (
                    <>
                        <Skeleton className="w-7 h-4" />
                        <Skeleton className="flex-grow h-2" />
                        <Skeleton className="w-7 h-4" />
                    </>
                )}
            </div>
        </div>
    );
}

function formatTime(ms: number): string {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
