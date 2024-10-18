import { PlayableTrack } from "@/services/spotify/spotifyDTOs";
import { create } from "zustand";

interface SpotifyTracksStore {
    tracks: PlayableTrack[];
    setTracks: (tracks: PlayableTrack[]) => void;
    isSearching: boolean;
    setIsSearching: (isSearching: boolean) => void;
    isShowingTracks: boolean;
    setIsShowingTracks: (isShowingTracks: boolean) => void;
}

export const useSpotifyTracksStore = create<SpotifyTracksStore>((set) => ({
    tracks: [],
    setTracks: (tracks: PlayableTrack[]) => set({ tracks }),
    isSearching: false,
    setIsSearching: (isSearching: boolean) => set({ isSearching }),
    isShowingTracks: true,
    setIsShowingTracks: (isShowingTracks: boolean) => set({ isShowingTracks }),
}));
