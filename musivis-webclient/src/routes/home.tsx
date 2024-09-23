import { Spotify } from "@/services/spotify/spotify";
import { SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { useEffect, useState } from "react";


function Home() {
    const [name, setName] = useState('');
    const [tracks, setTracks] = useState<SpotifyTrack[]>([]);

    useEffect(() => {
        Spotify.getMe().then(user => setName(user.display_name));
        Spotify.getTopTracks().then(tracks => setTracks(tracks.items));
    }, []);

    return(
        <>
            <h1 className="text-2xl font-bold text-center">
                Hi, {name}!
            </h1>
            {tracks && tracks.length > 0 && (
                <ul>
                    {tracks.map(track => (
                        <li key={track.id}>
                            {track.name}
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}

export default Home;