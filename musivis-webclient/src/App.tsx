import { ThemeProvider } from "@/components/theme-provider"
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './routes/Home';
import Callback from './routes/Callback';
import { ModeToggle } from './components/ui/mode-toggle';
import { useEffect, useState } from "react";
import Login from "./routes/Login";
import { SpotifyAuthorization } from "./services/spotifyAuthorization";

function App() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_MUSIVIS_BACKEND_URL as string;
    fetch(`${backendUrl}/status`)
      .then(response => response.text())
      .then(responseText => setStatus(responseText))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <header className="flex gap-4 p-4">
        <p className="font-bold">
          Musivis
        </p>
        <p className="grow">
          {status ? status : 'Loading status...'}
        </p>
        <ModeToggle></ModeToggle>
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