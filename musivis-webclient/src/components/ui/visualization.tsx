import {
    PlayableTrack,
    SpotifyAudioFeatures,
    SpotifyAudioAnalysis,
} from "@/services/spotify/spotifyDTOs";
import { SpotifyRepository } from "@/services/spotify/spotifyRepository";
import { useEffect, useState } from "react";
import WebGLCanvas from "./webgl-canvas";
import loadingIconSvg from "@/assets/musivis-icon-animated-loading.svg";

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
        // Show the animated loading icon centered in the page with fade-in effect
        return (
            <div className="flex flex-col justify-center items-center h-full w-full min-h-[300px] py-10">
                <div className="flex flex-col items-center animate-fade-in">
                    <img
                        src={loadingIconSvg}
                        alt="Loading visualization"
                        className="w-16 h-16 animate-fade-pulse"
                    />
                    <p className="text-muted-foreground mt-4 text-center animate-fade-in">
                        Analyzing track data...
                    </p>
                </div>
            </div>
        );
    }
    return <WebGLCanvas></WebGLCanvas>;
}
