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

export type WebPlaybackPlayer = {
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
    track_window: WebPlaybackTrackWindow;
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

export type WebPlaybackTrack = {
    uri: string; // Spotify URI "spotify:track:xxxx"
    id: string; // Spotify ID from URI (can be null) "xxxx"
    type: "track" | "episode" | "ad"; // Content type: can be "track", "episode" or "ad"
    media_type: "audio" | "video"; // Type of file: can be "audio" or "video"
    name: string; // Name of content
    is_playable: boolean; // Flag indicating whether it can be played
    album: {
        uri: string; // Spotify Album URI 'spotify:album:xxxx'
        name: string;
        images: [
            {
                url: string; // "https://image/xxxx"
            },
        ];
    };
    artists: [
        {
            uri: string; // Spotify Artist URI 'spotify:artist:xxxx'
            name: string;
        },
    ];
};

export type WebPlaybackTrackWindow = {
    current_track: WebPlaybackTrack; // The track currently on local playback
    previous_tracks: WebPlaybackTrack[]; // Previously played tracks. Number can vary.
    next_tracks: WebPlaybackTrack[]; // Tracks queued next. Number can vary.
};

export type WebPlaybackState = {
    context: {
        uri: string; // The URI of the context (can be null) 'spotify:album:xxx'
        metadata: object; // Additional metadata for the context (can be null)
    };
    disallows: {
        // A simplified set of restriction controls for
        pausing: boolean; // The current track. By default, these fields
        peeking_next: boolean; // will either be set to false or undefined, which
        peeking_prev: boolean; // indicates that the particular operation is
        resuming: boolean; // allowed. When the field is set to `true`, this
        seeking: boolean; // means that the operation is not permitted. For
        skipping_next: boolean; // example, `skipping_next`, `skipping_prev` and
        skipping_prev: boolean; // `seeking` will be set to `true` when playing an
        // ad track.
    };
    paused: boolean; // Whether the current track is paused.
    position: number; // The position_ms of the current track.
    repeat_mode: number; // The repeat mode. No repeat mode is 0,
    // repeat context is 1 and repeat track is 2.
    shuffle: boolean; // True if shuffled, false otherwise.
    track_window: WebPlaybackTrackWindow;
};
