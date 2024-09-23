import { ThemeProvider } from "@/components/theme-provider"
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './routes/home';
import Callback from './routes/callback';
import { ModeToggle } from './components/ui/mode-toggle';
import { useEffect, useState } from "react";
import Login from "./routes/login";
import { SpotifyAuthorization } from "./services/spotify/spotifyAuthorization";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import Profile from "./components/ui/profile";
import { Spotify } from "./services/spotify/spotify";

export type User = {
  display_name: string;
  email: string;
  id: string;
  images: {
    height: number | null;
    url: string;
    width: number | null;
  }[];
}

function App() {

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_MUSIVIS_BACKEND_URL as string;
    fetch(`${backendUrl}/status`)
      .then(response => response.text())
      .then(responseText =>console.log('Backend status:', responseText))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (SpotifyAuthorization.isLoggedIn()) {
      Spotify.getMe().then(setUser);
    }
  }, []);

  const handleLogOut = () => {
    SpotifyAuthorization.logOut();
    setUser(null);
  }
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <header className="flex gap-4 p-4">
        <h1 className="font-bold text-2xl grow">
          Musivis
        </h1>
        <Profile user={user} onLogOut={handleLogOut}></Profile>
      </header>
      <Routes>
        <Route path="/" element={SpotifyAuthorization.isLoggedIn() ? <Home/> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/callback" element={<Callback />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App