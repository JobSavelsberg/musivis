import {
    SpotifyAudioAnalysis,
    SpotifyAudioFeatures,
    SpotifyPagedResult,
    SpotifyTimeRanges,
    SpotifyTrack,
    SpotifyUser,
} from "./spotifyDTOs";

export class SpotifyRepository {
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
        switch (response.status) {
            case 401:
                window.location.href = "/login";
                break;
            case 403:
            case 404:
            case 500: {
                let errorMessage: string = `${response.status} ${response.statusText}`;
                try {
                    errorMessage = (await response.json()).error.message;
                } catch (e) {
                    console.error(e);
                }
                throw new Error(errorMessage);
            }
        }

        if (response.ok) {
            // check type of response
            const contentType = response.headers.get("content-type");
            if (!contentType) {
                return {} as T;
            }
            if (contentType.includes("application/json")) {
                return response.json();
            }
        }

        return {} as T;
    }

    private static async put<T, U>(endpoint: string, body?: T): Promise<U> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            body: body ? JSON.stringify(body) : undefined,
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

    public static async search(
        query: string,
    ): Promise<{ tracks: SpotifyPagedResult<SpotifyTrack> }> {
        const uri = "search";

        const params = new URLSearchParams();
        params.append("q", query);
        params.append("type", "track");
        const uriWithParams = `${uri}?${params.toString()}`;

        return this.get(uriWithParams);
    }

    //#region Player
    public static async transferPlaybackToDevice(
        deviceId: string,
    ): Promise<void> {
        return this.put("me/player", { device_ids: [deviceId] });
    }

    public static async playTrack(trackuri?: string): Promise<void> {
        const body = trackuri ? { uris: [trackuri] } : undefined;
        return this.put("me/player/play", body);
    }

    public static async pause(): Promise<void> {
        await this.put("me/player/pause");
    }

    //#endregion

    //#region Features & analysis
    public static async getAudioFeatures(
        trackId: string,
    ): Promise<SpotifyAudioFeatures> {
        return this.get(`audio-features/${trackId}`);
    }

    public static async getAudioAnalysis(
        trackId: string,
    ): Promise<SpotifyAudioAnalysis> {
        return this.get(`audio-analysis/${trackId}`);
    }

    //#endregion
}
