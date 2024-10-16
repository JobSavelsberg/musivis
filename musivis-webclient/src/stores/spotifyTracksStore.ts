import { PlayableTrack } from "@/services/spotify/spotifyDTOs";
import { create } from "zustand";

interface SpotifyTracksStore {
    tracks: PlayableTrack[];
    setTracks: (tracks: PlayableTrack[]) => void;
}

export const useSpotifyTracksStore = create<SpotifyTracksStore>((set) => ({
    tracks: [],
    setTracks: (tracks: PlayableTrack[]) => set({ tracks }),
}));
