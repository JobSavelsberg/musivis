import { Route, Routes } from "react-router-dom";
import Home from "./routes/home";
import Callback from "./routes/callback";
import { useContext, useEffect } from "react";
import Login from "./routes/login";
import Profile from "./components/ui/profile";
import { AuthContext } from "./components/auth-provider";

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
    const { logout, user } = useContext(AuthContext);

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_MUSIVIS_BACKEND_URL as string;
        fetch(`${backendUrl}/status`)
            .then((response) => response.text())
            .then((responseText) =>
                console.log("Backend status:", responseText),
            )
            .catch((error) => console.warn("Error fetching data:", error));
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <header className="flex gap-4 p-4">
                <h1 className="font-bold text-2xl grow">Musivis</h1>
                <Profile user={user} onLogOut={logout}></Profile>
            </header>
            <main className="flex-grow flex flex-col">
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
