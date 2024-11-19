import {
    PlayableTrack,
    SpotifyAudioFeatures,
    SpotifyAudioAnalysis,
} from "@/services/spotify/spotifyDTOs";
import { SpotifyRepository } from "@/services/spotify/spotifyRepository";
import { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";
import WebGLCanvas from "./webgl-canvas";

interface VisualizationProps {
    track: PlayableTrack | null;
}

export default function Visualization({ track }: VisualizationProps) {
    const [audioFeatures, setAudioFeatures] =
        useState<SpotifyAudioFeatures | null>(null);
    const [audioAnalysis, setAudioAnalysis] =
        useState<SpotifyAudioAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (track) {
            setError(null); // Reset error state
            SpotifyRepository.getAudioFeatures(track.id)
                .then(setAudioFeatures)
                .catch((err) => {
                    setError(`Failed to fetch audio features: ${err.message}`);
                });
            SpotifyRepository.getAudioAnalysis(track.id)
                .then(setAudioAnalysis)
                .catch((err) => {
                    setError(`Failed to fetch audio analysis: ${err.message}`);
                });
        }
    }, [track]);

    if (!track) {
        return <div></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!audioAnalysis || !audioAnalysis.track || !audioFeatures) {
        // skeleton
        return <Skeleton className="h-32" />;
    }
    return <WebGLCanvas></WebGLCanvas>;
}
