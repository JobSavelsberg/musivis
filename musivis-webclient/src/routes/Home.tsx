import { ModeToggle } from "@/components/ui/mode-toggle";
import { SpotifyLoginForm } from "@/components/ui/spotify-login-form";
import { useEffect, useState } from "react";

function Home(){
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
      fetch('https://musivis-api.fly.dev/status')
        .then(response => response.text())
        .then(responseText => setStatus(responseText))
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  
    return (
        <div>
            <h1 className="text-3xl font-bold underline">
                Musivis
            </h1>
            <p className="text-xl">
                {status ? status : 'Loading status...'}
            </p>
            <div className='p-2'>
                <ModeToggle></ModeToggle>
            </div>
            <SpotifyLoginForm></SpotifyLoginForm>
        </div>
    );
}

export default Home;