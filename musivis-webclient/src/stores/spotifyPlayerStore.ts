import { PlayableTrack, SpotifyDevice } from "@/services/spotify/spotifyDTOs";
import { create } from "zustand";

interface SpotifyPlayerStore {
    isReady: boolean;
    setReady: (isReady: boolean) => void;

    isPlaying: boolean;
    setPlaying: (isPlaying: boolean) => void;

    position: number;
    setPosition: (position: number) => void;

    currentTrack: PlayableTrack | null;
    setCurrentTrack: (track: PlayableTrack) => void;

    availableDevices: SpotifyDevice[];
    setAvailableDevices: (availableDevices: SpotifyDevice[]) => void;

    activeDevice: SpotifyDevice | null;
}
// interval
let interval: NodeJS.Timeout | null;
const positionUpdateTime = 10; //ms

export const useSpotifyPlayerStore = create<SpotifyPlayerStore>((set) => ({
    isReady: false,
    setReady: (isReady: boolean) => set({ isReady }),

    isPlaying: false,
    setPlaying(isPlaying: boolean) {
        if (isPlaying != this.isPlaying) {
            set({ isPlaying });
            // update position every 100ms
            if (isPlaying) {
                interval = setInterval(() => {
                    set((state) => ({
                        position: state.position + positionUpdateTime,
                    }));
                }, positionUpdateTime);
            } else {
                if (interval) {
                    clearInterval(interval);
                }
            }
        }
    },

    position: 0,
    setPosition: (position: number) => set({ position }),

    currentTrack: null,
    setCurrentTrack: (track: PlayableTrack) => set({ currentTrack: track }),

    availableDevices: [],
    setAvailableDevices: (availableDevices: SpotifyDevice[]) => {
        // also update active device
        const activeDevice = availableDevices.find(
            (device) => device.is_active,
        );
        if (activeDevice) {
            set({ activeDevice });
        }

        return set({ availableDevices });
    },

    activeDevice: null,
}));
