import {
    PlayableTrack,
    SpotifyAudioFeatures,
    SpotifyAudioAnalysis,
} from "@/services/spotify/spotifyDTOs";
import { SpotifyRepository } from "@/services/spotify/spotifyRepository";
import React, { useEffect, useState } from "react";

interface VisualizationProps {
    track: PlayableTrack | null;
}

const Visualization: React.FC<VisualizationProps> = ({ track }) => {
    const [audioFeatures, setAudioFeatures] =
        useState<SpotifyAudioFeatures | null>(null);
    const [audioAnalysis, setAudioAnalysis] =
        useState<SpotifyAudioAnalysis | null>(null);

    useEffect(() => {
        if (track) {
            SpotifyRepository.getAudioFeatures(track.id).then(setAudioFeatures);
            SpotifyRepository.getAudioAnalysis(track.id).then(setAudioAnalysis);
        }
    }, [track]);

    if (!track) {
        return <div></div>;
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
