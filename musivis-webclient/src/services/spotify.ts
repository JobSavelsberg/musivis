// Copyright 2024 Sorama B.V.
export type SpotifyUser = {
    display_name: string;
    email: string;
    external_urls: {
        spotify: string;
    }
    followers: {
        href: string;
        total: number;
    }
    href: string;
    id: string;
    images: {
        height: number;
        url: string;
        width: number;
    }[]
    type: string;
    uri: string;
}


export class Spotify{


    
    public static async getMe(): Promise<SpotifyUser>{
        const token = localStorage.getItem('access_token');
        if(!token){
            throw new Error('No token found');
        }
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return await response.json();
    }
}