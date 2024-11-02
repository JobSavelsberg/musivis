import { PlayableTrack } from "@/services/spotify/spotifyDTOs";
import React from "react";

interface VisualizationProps {
    track: PlayableTrack | null;
}

const Visualization: React.FC<VisualizationProps> = ({ track }) => {
    if (!track) {
        return <div></div>;
    }
    return (
        <div>
            <h2>Data Visualization</h2>
            <div>
                <p>Track: {track.name}</p>
            </div>
        </div>
    );
};

export default Visualization;
