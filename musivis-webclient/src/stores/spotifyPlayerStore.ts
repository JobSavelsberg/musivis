import { create } from "zustand";

interface SpotifyPlayerStore {
    isReady: boolean;
    setReady: (isReady: boolean) => void;
}

export const useSpotifyPlayerStore = create<SpotifyPlayerStore>((set) => ({
    isReady: false,
    setReady: (isReady: boolean) => set({ isReady }),
}));
