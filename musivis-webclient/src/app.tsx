import { Route, Routes } from "react-router-dom";
import Home from "./routes/home";
import Callback from "./routes/callback";
import { useContext, useEffect, useState } from "react";
import Login from "./routes/login";
import Profile from "./components/ui/profile";
import { AuthContext } from "./components/auth-provider";
import { Input } from "./components/ui/input";
import { useDebounce } from "./hooks/useDebounce";
import { SpotifyRepository } from "./services/spotify/spotifyRepository";
import { PlayableTrack } from "./services/spotify/spotifyDTOs";
import { useSpotifyTracksStore } from "./stores/spotifyTracksStore";

export type User = {
    display_name: string;
    email: string;
    id: string;
    images: {
        height: number | null;
        url: string;
        width: number | null;
    }[];
};

function App() {
    const { logout, user, isLoggedIn } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const { setTracks } = useSpotifyTracksStore();
    const debouncedSearch = useDebounce(search, 150);

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_MUSIVIS_BACKEND_URL as string;
        fetch(`${backendUrl}/status`)
            .then((response) => response.text())
            .then((responseText) =>
                console.log("Backend status:", responseText),
            )
            .catch((error) => console.warn("Error fetching data:", error));
    }, []);

    useEffect(() => {
        if (debouncedSearch) {
            SpotifyRepository.search(debouncedSearch).then((result) => {
                setTracks(result.tracks.items as PlayableTrack[]);
            });
        }
    }, [debouncedSearch, setTracks]);

    return (
        <div className="flex flex-col h-screen px-4 pt-4 pb-2">
            <header className="grid grid-cols-3 items-center">
                <h1 className="font-bold text-2xl grow">Musivis</h1>
                <div>
                    {isLoggedIn && (
                        <Input
                            placeholder="What music do you want to visualize?"
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    )}
                </div>
                <div className="justify-self-end">
                    <Profile user={user} onLogOut={logout} />
                </div>
            </header>
            <main className="flex-grow flex flex-col mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login/callback" element={<Callback />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
