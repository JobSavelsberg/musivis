import {
    PlayableTrack,
    SpotifyAudioFeatures,
    SpotifyAudioAnalysis,
} from "@/services/spotify/spotifyDTOs";
import { SpotifyRepository } from "@/services/spotify/spotifyRepository";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./skeleton";

interface VisualizationProps {
    track: PlayableTrack | null;
}

const Visualization: React.FC<VisualizationProps> = ({ track }) => {
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
    return (
        <div>
            {audioFeatures && (
                <div>
                    <p>Danceability: {audioFeatures.danceability}</p>
                    <p>Energy: {audioFeatures.energy}</p>
                    <p>Tempo: {audioFeatures.tempo}</p>
                </div>
            )}
            {audioAnalysis && (
                <div>
                    <p>Key: {audioAnalysis.track.key}</p>
                    <p>Mode: {audioAnalysis.track.mode}</p>
                    <p>Time Signature: {audioAnalysis.track.time_signature}</p>
                </div>
            )}
        </div>
    );
};

export default Visualization;
