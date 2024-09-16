// Copyright 2024 Sorama B.V.
import { PKCY } from "./PKCY";

// PKCY authentication with spotify
export class SpotifyAuthorization{
    // Import from .env file
    private static readonly clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string; 
    private static readonly redirectUrl = import.meta.env.VITE_SPOTIFY_REDIRECT_URL as string;
    
    private static readonly authorizationEndpoint = "https://accounts.spotify.com/authorize";
    private static readonly tokenEndpoint = "https://accounts.spotify.com/api/token";
    private static readonly scope = 'user-read-private user-read-email';

    public static isLoggedIn(): boolean{
        const expiry = localStorage.getItem('expiry');
        if(!expiry){
            return false;
        }
        return new Date(expiry) > new Date;
    }

    public static async authorize(){
        // Generate code challenge
        const codeVerifier  = PKCY.generateRandomString(64);
        const hashed = await PKCY.sha256(codeVerifier)
        const codeChallenge = PKCY.base64encode(hashed);

        window.localStorage.setItem('code_verifier', codeVerifier);
        const params =  {
            response_type: 'code',
            client_id: SpotifyAuthorization.clientId,
            scope: SpotifyAuthorization.scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: SpotifyAuthorization.redirectUrl,
        }

        const authUrl = new URL(SpotifyAuthorization.authorizationEndpoint);
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }

    public static async exchangeCodeForToken(code: string){
        // stored in the authorize step
        const codeVerifier = localStorage.getItem('code_verifier');
        
        if(!codeVerifier){
            throw new Error('Code verifier not found');
        }

        const payload = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
            client_id: SpotifyAuthorization.clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: SpotifyAuthorization.redirectUrl,
            code_verifier: codeVerifier,
            }),
        }
        
        const body = await fetch(SpotifyAuthorization.tokenEndpoint, payload);
        const response = await body.json();
        
        localStorage.setItem('access_token', response.access_token);
        
        // Also store expiry time and refresh token
        const expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + response.expires_in);

        localStorage.setItem('expiry', expiry.toISOString());
        localStorage.setItem('refresh_token', response.refresh_token);

        // Refresh
        window.location.href = '/';    
    }
}

