import Home from "./routes/home";
import Callback from "./routes/callback";
import { useContext, useEffect, useState } from "react";
import Login from "./routes/login";
import Profile from "./components/ui/profile";
import { AuthContext } from "./components/auth-provider";
import { Input } from "./components/ui/input";
import { useDebounce } from "./hooks/useDebounce";
import { useWindowSize } from "./hooks/useWindowSize";
import { SpotifyRepository } from "./services/spotify/spotifyRepository";
import { PlayableTrack } from "./services/spotify/spotifyDTOs";
import { useSpotifyTracksStore } from "./stores/spotifyTracksStore";
import { SearchIcon } from "lucide-react";
import { Link, Route, Routes } from "react-router-dom";
import SpotifyBlackIcon from "./assets/spotify/spotify-icon-black.svg";
import SpotifyWhiteIcon from "./assets/spotify/spotify-icon-white.svg";
import MusivisIcon from "./assets/spotify/musivis-icon.svg";

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
    const { setTracks, setIsSearching } = useSpotifyTracksStore();
    const debouncedSearch = useDebounce(search, 150);
    const { width } = useWindowSize();

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
            <header className="flex items-center gap-4">
                {/* Left side container */}
                <div className="flex items-center gap-4 justify-start flex-shrink-0">
                    {/* Spotify Logo - fixed size, won't shrink */}
                    <div className="flex-shrink-0">
                        <a
                            href="https://open.spotify.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                        >
                            <img
                                src={SpotifyBlackIcon}
                                alt="Spotify"
                                className="h-6 dark:hidden"
                            />
                            <img
                                src={SpotifyWhiteIcon}
                                alt="Spotify"
                                className="h-6 hidden dark:block"
                            />
                        </a>
                    </div>
                    {/* Musivis Logo - Musivis text can hide on small screens */}
                    <Link
                        to="/"
                        className="flex-shrink-0 font-bold text-2xl flex items-center gap-3"
                    >
                        <img
                            src={MusivisIcon}
                            alt="Musivis Logo"
                            className="h-6 flex-shrink-0"
                        />
                        <span className="hidden md:inline">Musivis</span>
                    </Link>
                </div>

                {/* Search Bar - centered in the middle column, show different versions based on screen size*/}
                <div className="z-10 w-full flex-grow flex justify-center">
                    {isLoggedIn && (
                        <div className="relative w-full max-w-xl mx-auto">
                            <Input
                                placeholder={
                                    width < 450
                                        ? "Search music..."
                                        : "What music do you want to visualize?"
                                }
                                className="pl-10 w-full"
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                onFocus={() => setIsSearching(true)}
                                // Set a small timeout before setting searching to false to allow tabbing to the results
                                onBlur={() =>
                                    setTimeout(() => setIsSearching(false), 100)
                                }
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Invisible spacer div to balance the layout */}
                <div className="hidden lg:inline invisible w-48"></div>

                {/* Right side container */}
                <div className="flex justify-end">
                    {/* Profile - fixed position on the right */}
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
