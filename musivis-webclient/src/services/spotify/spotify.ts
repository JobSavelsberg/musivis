import {
    SpotifyPagedResult,
    SpotifyPlayerPlay,
    SpotifyTimeRanges,
    SpotifyTrack,
    SpotifyUser,
} from "./spotifyDTOs";

export class Spotify {
    private static readonly baseUrl = "https://api.spotify.com/v1/";

    private static headers(): HeadersInit {
        const token = localStorage.getItem("access_token");
        if (!token) {
            throw new Error("No token found");
        }
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    private static async parseResponse<T>(response: Response): Promise<T> {
        if (response.status === 401) {
            window.location.href = "/login";
        }
        if (response.ok) {
            return response.json();
        }

        return {} as T;
    }

    private static async put<T, U>(endpoint: string, body: T): Promise<U> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            body: JSON.stringify(body),
            method: "PUT",
            headers: this.headers(),
        });
        return this.parseResponse(response);
    }

    private static async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: this.headers(),
        });
        return this.parseResponse(response);
    }

    public static async getMe(): Promise<SpotifyUser> {
        return this.get("me");
    }

    public static async getTopTracks(
        timeRange: SpotifyTimeRanges = "medium_term",
        limit: number = 20,
        offset: number = 0,
    ): Promise<SpotifyPagedResult<SpotifyTrack>> {
        const uri = "me/top/tracks";

        // add uri parameters using URLSearchParams
        const params = new URLSearchParams();
        params.append("time_range", timeRange);
        params.append("limit", limit.toString());
        params.append("offset", offset.toString());

        // append the parameters to the uri
        const uriWithParams = `${uri}?${params.toString()}`;

        return this.get(uriWithParams);
    }

    //#region Player
    public static async transferPlaybackToDevice(
        deviceId: string,
    ): Promise<void> {
        return this.put("me/player", { device_ids: [deviceId] });
    }

    public static async play(
        track?: SpotifyTrack,
        position?: number,
    ): Promise<void> {
        const body: SpotifyPlayerPlay = {};
        if (track) {
            body.uris = [track.uri];
        }
        if (position !== undefined) {
            body.position_ms = position;
        }

        await this.put("me/player/play", body);
    }

    //#endregion
}
