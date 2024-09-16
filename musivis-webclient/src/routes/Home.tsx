import { Spotify } from "@/services/spotify";
import { useEffect, useState } from "react";


function Home() {
    const [name, setName] = useState('');

    useEffect(() => {
        Spotify.getMe().then(user => setName(user.display_name));
    }, []);

    return(
        <div>
            <h1 className="text-2xl font-bold text-center">
                Hi, {name}!
            </h1>
        </div>
    )
}

export default Home;