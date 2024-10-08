import { PlayableTrack } from "@/services/spotify/spotifyDTOs";
import { create } from "zustand";

interface SpotifyPlayerStore {
    isReady: boolean;
    setReady: (isReady: boolean) => void;

    isPlaying: boolean;
    setPlaying: (isPlaying: boolean) => void;

    currentTrack: PlayableTrack | null;
    setCurrentTrack: (track: PlayableTrack) => void;
}

export const useSpotifyPlayerStore = create<SpotifyPlayerStore>((set) => ({
    isReady: false,
    setReady: (isReady: boolean) => set({ isReady }),

    isPlaying: false,
    setPlaying: (isPlaying: boolean) => set({ isPlaying }),

    currentTrack: null,
    setCurrentTrack: (currentTrack: PlayableTrack) => set({ currentTrack }),
}));
