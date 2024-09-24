import {
    SpotifyPagedResult,
    SpotifyTimeRanges,
    SpotifyTrack,
    SpotifyUser,
} from "./spotify/spotifyDTOs";

export class Spotify {
    private static async get<T>(uri: string): Promise<T> {
        const token = localStorage.getItem("access_token");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await fetch(`https://api.spotify.com/v1/${uri}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // If forbidden, redirect to login
        if (response.status === 401) {
            window.location.href = "/login";
        }

        return await response.json();
    }

    public static async getMe(): Promise<SpotifyUser> {
        return await this.get("me");
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

        return await this.get(uriWithParams);
    }
}
