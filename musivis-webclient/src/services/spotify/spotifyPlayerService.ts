import { useSpotifyPlayerStore } from "@/stores/spotifyPlayerStore";
import {
    PlayableTrack,
    SpotifyDevice,
    SpotifyDeviceId,
    SpotifyPlayerState,
    WebPlaybackState,
} from "./spotifyDTOs";
import { SpotifyRepository } from "./spotifyRepository";

type ReadyListener = (device_id: SpotifyDeviceId) => void;
type StateListener = (state: WebPlaybackState) => void;

type SpotifyPlayerType = {
    addListener: (event: string, cb: StateListener | ReadyListener) => void;
    connect: () => Promise<boolean>;
    getCurrentState: () => Promise<WebPlaybackState | undefined>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    seek: (position: number) => Promise<void>;
};

declare global {
    interface Window {
        Spotify: {
            Player: new (options: {
                name: string;
                getOAuthToken: (cb: (token: string) => void) => void;
                volume: number;
            }) => SpotifyPlayerType;
        };
        onSpotifyWebPlaybackSDKReady: () => void;
    }
}

export class SpotifyPlayerService {
    public static readonly LOCAL_PLAYER_NAME = "Musivis";

    private static seekPromise: Promise<void> | null = null;

    public static player: SpotifyPlayerType | undefined;

    private static get localDevice(): SpotifyDevice | undefined {
        return useSpotifyPlayerStore
            .getState()
            .availableDevices.find(
                (device) => device.name === this.LOCAL_PLAYER_NAME,
            );
    }

    private static get isPlaybackLocal(): boolean {
        return this.localDevice?.is_active || false;
    }

    public static get isScriptAdded(): boolean {
        const addedScript = document.querySelector(
            "script[src='https://sdk.scdn.co/spotify-player.js']",
        );

        return !!addedScript;
    }

    public static addScript() {
        if (this.isScriptAdded) {
            throw new Error("Script already added");
        }
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            this.initializePlayer();
        };
    }

    private static initializePlayer() {
        if (this.player) {
            throw new Error("Player already initialized");
        }

        this.player = new window.Spotify.Player({
            name: "Musivis",
            getOAuthToken: (cb) => {
                const token = localStorage.getItem("access_token");
                cb(token || "");
            },
            volume: 0.5,
        });

        this.player.addListener("ready", ({ device_id }: SpotifyDeviceId) => {
            this.onReady(device_id);
        });

        this.player.addListener(
            "not_ready",
            ({ device_id }: SpotifyDeviceId) => {
                this.onNotReady(device_id);
            },
        );

        this.player.addListener(
            "player_state_changed",
            (state: WebPlaybackState) => this.stateChangedHandler(state),
        );

        // The .then will be executed before the "ready" event is fired
        this.player.connect().then((success) => {
            console.log("Connected", success);
        });
    }

    private static async onReady(deviceId: string) {
        console.log("Connected with Device ID", deviceId);

        // Now ask spotify to give us the full list of devices (which should include Musivis)
        await this.updateAvailableDevices();

        // Check if only the local device is available
        const isOnlyLocalDeviceAvailable =
            useSpotifyPlayerStore.getState().availableDevices.length === 1 &&
            this.localDevice;

        if (isOnlyLocalDeviceAvailable) {
            this.transferPlaybackToDevice(this.localDevice);
        } else {
            this.updateStateFromSpotifyServer();
        }

        // Set the player as ready so anything that depends on it can start
        useSpotifyPlayerStore.getState().setReady(true);
    }

    private static async onNotReady(deviceId: string) {
        console.warn("Device ID has gone offline", deviceId);
        useSpotifyPlayerStore.getState().setReady(false);
    }

    public static async play(trackURI?: string) {
        // If no device is active, try to find "Musivis", otherwise just use the first device
        if (!useSpotifyPlayerStore.getState().activeDevice) {
            if (this.localDevice) {
                await this.transferPlaybackToDevice(this.localDevice);
            } else if (
                useSpotifyPlayerStore.getState().availableDevices.length
            ) {
                await this.transferPlaybackToDevice(
                    useSpotifyPlayerStore.getState().availableDevices[0],
                );
            }
        }

        try {
            await SpotifyRepository.playTrack({
                trackuri: trackURI,
            });
            useSpotifyPlayerStore.getState().setPlaying(true);
            // If playing on the web api, we need to update the state from the server
            if (!this.isPlaybackLocal) {
                setTimeout(() => {
                    this.updateStateFromSpotifyServer();
                }, 100);
            }
        } catch (e) {
            console.error(e);
        }
    }

    public static async pause() {
        try {
            await SpotifyRepository.pause();
            useSpotifyPlayerStore.getState().setPlaying(false);
        } catch (e) {
            console.error(e);
        }
    }

    public static async seek(position: number) {
        if (!this.isPlaybackLocal) {
            if (!this.seekPromise) {
                this.seekPromise = SpotifyRepository.seek(position).then(() => {
                    // Wait for the server to update the state
                    setTimeout(() => {
                        this.updateStateFromSpotifyServer();
                    }, 50);

                    this.seekPromise = null;
                });
            }

            await this.seekPromise;
        }

        if (this.player) {
            this.player.seek(position);
        }

        useSpotifyPlayerStore.getState().setPosition(position);
    }

    private static stateChangedHandler(state: WebPlaybackState) {
        const isSpotifyPlaying = !state.paused;
        // only update if necessary
        if (useSpotifyPlayerStore.getState().isPlaying !== isSpotifyPlaying) {
            useSpotifyPlayerStore.getState().setPlaying(!state.paused);
        }

        const spotifyTrackPlaying = state.track_window
            .current_track as PlayableTrack;
        if (
            useSpotifyPlayerStore.getState().currentTrack?.uri !==
            spotifyTrackPlaying.uri
        ) {
            useSpotifyPlayerStore
                .getState()
                .setCurrentTrack(
                    state.track_window.current_track as PlayableTrack,
                );
        }

        // Make sure position is correct
        if (state.position !== useSpotifyPlayerStore.getState().position) {
            useSpotifyPlayerStore.getState().setPosition(state.position);
        }
    }

    private static updateStateFromSpotifyServer() {
        SpotifyRepository.getPlayerState().then((state) => {
            // If there is nothing being played on another device, we'll just switch to the local device right away
            if ((!state || !state.is_playing) && this.localDevice) {
                this.transferPlaybackToDevice(this.localDevice);
            }

            if (state) {
                if (!state.item) {
                    console.warn("No track playing");
                    return;
                }

                this.stateChangedHandler(
                    SpotifyPlayerService.serverToLocalPlayerState(state),
                );

                // Set a timeout to fetch again when the track ends
                const trackDuration = state.item.duration_ms;
                const timeLeft = trackDuration - state.progress_ms;
                setTimeout(() => {
                    this.updateStateFromSpotifyServer();
                }, timeLeft);
            }
        });
    }

    private static serverToLocalPlayerState(
        state: SpotifyPlayerState,
    ): WebPlaybackState {
        return {
            track_window: {
                current_track: {
                    ...state.item,
                },
            },
            paused: !state.is_playing,
            position: state.progress_ms,
        } as unknown as WebPlaybackState;
    }

    public static async transferPlaybackToDevice(
        device: SpotifyDevice,
    ): Promise<void> {
        try {
            await SpotifyRepository.transferPlaybackToDevice(device.id);
            // refresh the available devices
            await this.updateAvailableDevices();
        } catch {
            console.error("Failed to transfer playback to device", device);
        }
    }

    public static async updateAvailableDevices(): Promise<void> {
        await SpotifyRepository.getAvailableDevices().then((devices) => {
            if (
                !devices.some(
                    (device) => device.name === this.LOCAL_PLAYER_NAME,
                )
            ) {
                console.warn("Local player not found");
            }

            useSpotifyPlayerStore.getState().setAvailableDevices(devices);
        });
    }
}
