import { useSpotifyPlayerStore } from "@/stores/spotifyPlayerStore";
import {
    PlayableTrack,
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

export type Device = {
    id: string;
    name: string;
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
    private static localDevice: Device | null = null;
    public static isTransferringPlaybackImmediately: boolean = false;

    private static seekPromise: Promise<void> | null = null;

    public static player: SpotifyPlayerType | undefined;

    private static readyListener: ReadyListener;
    private static notReadyListener: ReadyListener;
    private static stateChangedListener: StateListener;

    private static get isPlaybackLocal() {
        return this.localDevice && this.localDevice.name === this.LOCAL_PLAYER_NAME;
    }

    public static addScript() {
        if (this.isScriptAdded()) {
            throw new Error("Script already added");
        }
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            this.initializeReadyPlayer();
        };
    }

    public static isScriptAdded() {
        const addedScript = document.querySelector(
            "script[src='https://sdk.scdn.co/spotify-player.js']",
        );

        return addedScript;
    }

    private static initializeReadyPlayer() {
        if (this.player) {
            throw new Error("Player already initialized");
        }

        console.log("Initializing Spotify Player");

        this.player = new window.Spotify.Player({
            name: "Musivis",
            getOAuthToken: (cb) => {
                const token = localStorage.getItem("access_token");
                cb(token || "");
            },
            volume: 0.5,
        });

        this.readyListener = ({ device_id }) => {
            console.log("Connected with Device ID", device_id);
            this.localDevice = {
                id: device_id,
                name: this.LOCAL_PLAYER_NAME,
            };
            useSpotifyPlayerStore.getState().addAvailableDevice(this.localDevice);
            useSpotifyPlayerStore.getState().setReady(true);
   

            if(this.isTransferringPlaybackImmediately){
                this.transferPlaybackToDevice(this.localDevice);
            }else{
                this.updateStateFromSpotifyServer();
            }
        };

        this.player.addListener("ready", this.readyListener);

        this.notReadyListener = ({ device_id }) => {
            console.warn("Device ID has gone offline", device_id);
            useSpotifyPlayerStore.getState().setReady(false);
        };
        this.player.addListener("not_ready", this.notReadyListener);

        this.stateChangedListener = (state) => {
            this.stateChangedHandler(state);
           
        };
        this.player.addListener(
            "player_state_changed",
            this.stateChangedListener,
        );

        this.player.connect().then((success) => {
            console.log("Connected", success);
        });
    }

    public static async play(trackURI?: string) {
        try {
            await SpotifyRepository.playTrack(trackURI);
            useSpotifyPlayerStore.getState().setPlaying(true);
            // If playing on the web api, we need to update the state from the server
            if(!this.isPlaybackLocal){
                setTimeout(() => {
                    this.updateStateFromSpotifyServer();
                }, 50);
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
        if(!this.isPlaybackLocal){
            if(!this.seekPromise){
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

        if(this.player){
            this.player.seek(position);
        }

        useSpotifyPlayerStore.getState().setPosition(position);
    }

    private static stateChangedHandler(state: WebPlaybackState) {
        const isSpotifyPlaying = !state.paused;
        // only update if necessary
        if (
            useSpotifyPlayerStore.getState().isPlaying !== isSpotifyPlaying
        ) {
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
    
    private static updateStateFromSpotifyServer(){
        SpotifyRepository.getPlayerState().then((state) => {
            // If there is nothing being played on another device, we'll just switch to the local device right away
            if((!state || !state.is_playing) && this.localDevice){
                this.transferPlaybackToDevice(this.localDevice);
            }

            if (state) {
                this.checkForNewDevice(state);

                this.stateChangedHandler(SpotifyPlayerService.serverToLocalPlayerState(state));

                // Set a timeout to fetch again when the track ends
                const trackDuration = state.item.duration_ms;
                const timeLeft = trackDuration - state.progress_ms;
                setTimeout(() => {
                    this.updateStateFromSpotifyServer();
                }, timeLeft);
            }
        });
    }

    private static serverToLocalPlayerState(state: SpotifyPlayerState): WebPlaybackState {
        return {
            track_window: {
                current_track: {
                    ...state.item,
                }
            },
            paused: !state.is_playing,
            position: state.progress_ms,
        } as unknown as WebPlaybackState;
    }

    private static checkForNewDevice(state: SpotifyPlayerState) {
        if(!state.device) return;
        const device = {
            id: state.device.id,
            name: state.device.name,
        }

        if (
            !useSpotifyPlayerStore.getState().availableDevices.some(
                (d) => d.id === device.id,
            )
        ) {
            useSpotifyPlayerStore.getState().addAvailableDevice(device);
        }

        // Since we got the state from the server, we can assume that the current device is the one we are using
        useSpotifyPlayerStore.getState().setCurrentDevice(device);
    }

    public static transferPlaybackToDevice(device: Device) {
        SpotifyRepository.transferPlaybackToDevice(device.id);
        useSpotifyPlayerStore.getState().setCurrentDevice(device);
    }
}
