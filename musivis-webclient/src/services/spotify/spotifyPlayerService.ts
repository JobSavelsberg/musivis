import { useSpotifyPlayerStore } from "@/stores/spotifyPlayerStore";
import {
    PlayableTrack,
    SpotifyDeviceId,
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
    public static player: SpotifyPlayerType | undefined;

    private static readyListener: ReadyListener;
    private static notReadyListener: ReadyListener;
    private static stateChangedListener: StateListener;

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
            useSpotifyPlayerStore.getState().setReady(true);

            SpotifyRepository.transferPlaybackToDevice(device_id);
        };
        this.player.addListener("ready", this.readyListener);

        this.notReadyListener = ({ device_id }) => {
            console.warn("Device ID has gone offline", device_id);
            useSpotifyPlayerStore.getState().setReady(false);
        };
        this.player.addListener("not_ready", this.notReadyListener);

        this.stateChangedListener = (state) => {
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
        this.player?.seek(position);
        useSpotifyPlayerStore.getState().setPosition(position);
    }
}
