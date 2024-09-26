export type SpotifyTimeRanges = "short_term" | "medium_term" | "long_term";

export type SpotifyPagedResult<T> = {
    href: string;
    items: T[];
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
};

export type SpotifyUser = {
    display_name: string;
    email: string;
    external_urls: {
        spotify: string;
    };
    followers: {
        href: string;
        total: number;
    };
    href: string;
    id: string;
    images: {
        height: number;
        url: string;
        width: number;
    }[];
    type: string;
    uri: string;
};

export type SpotifyTrack = {
    album: {
        album_type: string;
        total_tracks: number;
        available_markets: string[];
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        images: {
            height: number;
            url: string;
            width: number;
        }[];
        name: string;
        release_date: string;
        release_date_precision: string;
        restrictions: {
            reason: string;
        };
        type: string;
        uri: string;
        artists: {
            external_urls: {
                spotify: string;
            };
            href: string;
            id: string;
            name: string;
            type: string;
            uri: string;
        }[];
    };
    artists: {
        external_urls: {
            spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
    }[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
        isrc: string;
        ean: string;
        upc: string;
    };
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: unknown;
    restrictions: {
        reason: string;
    };
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
};

export type SpotifyPlayerPlay = {
    context_uri?: string;
    uris?: string[];
    offset?: { position?: number; uri?: string };
    position_ms?: number;
};

export type SpotifyPlayerState = {
    timestamp: number;
    context: {
        uri: string;
        metadata: unknown;
    };
    duration: number;
    paused: boolean;
    shuffle: boolean;
    shuffle_mode: number;
    position: number;
    loading: boolean;
    repeat_mode: number;
    track_window: {
        current_track: SpotifyTrack;
        next_tracks: SpotifyTrack[];
        previous_tracks: SpotifyTrack[];
    };
    playback_id: string;
    playback_quality: string;
    playback_features: {
        hifi_status: string;
        playback_speed: {
            current: number;
            selected: number;
            restricted: boolean;
        };
        signal_ids: [];
        modes: unknown;
    };
    playback_speed: number;
};

export type SpotifyDeviceId = {
    device_id: string;
};
