// PKCY authentication with spotify
export class SpotifyAuthorization{
    private static readonly clientId = '282afe06899342d48c952468af752318';
    private static readonly redirectUrl = 'https://localhost:5173/callback';
    
    private static readonly authorizationEndpoint = "https://accounts.spotify.com/authorize";
    private static readonly tokenEndpoint = "https://accounts.spotify.com/api/token";
    private static readonly scope = 'user-read-private user-read-email';

    public static async authorize(){
        // Generate code challenge
        const codeVerifier  = SpotifyAuthorization.generateRandomString(64);
        const hashed = await SpotifyAuthorization.sha256(codeVerifier)
        const codeChallenge = SpotifyAuthorization.base64encode(hashed);

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


    private static generateRandomString(length: number){
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }

    private static async sha256(plain: string){
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
    }

    private static base64encode(input: ArrayBuffer){
        return btoa(String.fromCharCode(...new Uint8Array(input)))
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
      }
}

