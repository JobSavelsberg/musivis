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

export type SpotifyDevice = {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
    supports_volume: boolean;
};

export type SpotifyPlayerState = {
    device: SpotifyDevice;
    repeat_state: string;
    shuffle_state: boolean;
    context: {
        type: string;
        href: string;
        external_urls: {
            spotify: string;
        };
        uri: string;
    };
    timestamp: number;
    progress_ms: number;
    is_playing: boolean;
    item: SpotifyTrack;
    currently_playing_type: string;
    actions: {
        interrupting_playback: boolean;
        pausing: boolean;
        resuming: boolean;
        seeking: boolean;
        skipping_next: boolean;
        skipping_prev: boolean;
        toggling_repeat_context: boolean;
        toggling_shuffle: boolean;
        toggling_repeat_track: boolean;
        transferring_playback: boolean;
    };
};

export type SpotifyPlayerPlay = {
    context_uri?: string;
    uris?: string[];
    offset?: { position?: number; uri?: string };
    position_ms?: number;
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
        images: {
            url: string; // "https://image/xxxx"
        }[];
    };
    artists: {
        uri: string; // Spotify Artist URI 'spotify:artist:xxxx'
        name: string;
    }[];
};

export type PlayableTrack = SpotifyTrack & WebPlaybackTrack;

export type WebPlaybackTrackWindow = {
    current_track: WebPlaybackTrack; // The track currently on local playback
    previous_tracks: WebPlaybackTrack[]; // Previously played tracks. Number can vary.
    next_tracks: WebPlaybackTrack[]; // Tracks queued next. Number can vary.
};

export type WebPlaybackState = {
    timestamp: number; // Unix Millisecond Timestamp
    context: {
        uri: string; // The URI of the context (can be null) 'spotify:album:xxx'
        metadata: object; // Additional metadata for the context (can be null)
    };

    duration: number; // The duration of the track.
    paused: boolean; // Whether the current track is paused.
    position: number; // The position_ms of the current track.
    shuffle: boolean; // True if shuffled, false otherwise.
    shuffle_mode: number; // The shuffle mode. 0 will be off, 1 will be on.
    repeat_mode: number; // The repeat mode. No repeat mode is 0,
    // repeat context is 1 and repeat track is 2.

    track_window: WebPlaybackTrackWindow;

    // Playback options
    playback_id: string; // A unique identifier of the current playback.
    playback_speed: number; // The current playback speed. This value is not
    playback_quality: string; // The current playback quality. This value is either
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

    // Disallows
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
};

export type SpotifyAudioFeatures = {
    /** A confidence measure from 0.0 to 1.0 of whether the track is acoustic. */
    acousticness: number;
    /** A URL to access the full audio analysis of this track. */
    analysis_url: string;
    /** Danceability describes how suitable a track is for dancing. */
    danceability: number;
    /** The duration of the track in milliseconds. */
    duration_ms: number;
    /** Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. */
    energy: number;
    /** The Spotify ID for the track. */
    id: string;
    /** Predicts whether a track contains no vocals. */
    instrumentalness: number;
    /** The key the track is in, using standard Pitch Class notation. */
    key: number;
    /** Detects the presence of an audience in the recording. */
    liveness: number;
    /** The overall loudness of a track in decibels (dB). */
    loudness: number;
    /** Mode indicates the modality (major or minor) of a track. */
    mode: number;
    /** Speechiness detects the presence of spoken words in a track. */
    speechiness: number;
    /** The overall estimated tempo of a track in beats per minute (BPM). */
    tempo: number;
    /** An estimated time signature of the track. */
    time_signature: number;
    /** A link to the Web API endpoint providing full details of the track. */
    track_href: string;
    /** The object type. */
    type: string;
    /** The Spotify URI for the track. */
    uri: string;
    /** A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. */
    valence: number;
};

export type SpotifyAudioAnalysisMeta = {
    /** The version of the Analyzer used to analyze this track. Example: "4.0.0" */
    analyzer_version: string;
    /** The platform used to read the track's audio data. Example: "Linux" */
    platform: string;
    /** A detailed status code for this track. Example: "OK" */
    detailed_status: string;
    /** The return code of the analyzer process. Example: 0 */
    status_code: number;
    /** The Unix timestamp (in seconds) at which this track was analyzed. Example: 1495193577 */
    timestamp: number;
    /** The amount of time taken to analyze this track. Example: 6.93906 */
    analysis_time: number;
    /** The method used to read the track's audio data. Example: "libvorbisfile L+R 44100->22050" */
    input_process: string;
};

export type SpotifyAudioAnalysisTrack = {
    /** The exact number of audio samples analyzed from this track. Example: 4585515 */
    num_samples: number;
    /** Length of the track in seconds. Example: 207.95985 */
    duration: number;
    /** This field will always contain the empty string. */
    sample_md5: string;
    /** An offset to the start of the region of the track that was analyzed. Example: 0 */
    offset_seconds: number;
    /** The length of the region of the track was analyzed. Example: 0 */
    window_seconds: number;
    /** The sample rate used to decode and analyze this track. Example: 22050 */
    analysis_sample_rate: number;
    /** The number of channels used for analysis. Example: 1 */
    analysis_channels: number;
    /** The time, in seconds, at which the track's fade-in period ends. Example: 0 */
    end_of_fade_in: number;
    /** The time, in seconds, at which the track's fade-out period starts. Example: 201.13705 */
    start_of_fade_out: number;
    /** The overall loudness of a track in decibels (dB). Example: -5.883 */
    loudness: number;
    /** The overall estimated tempo of a track in beats per minute (BPM). Example: 118.211 */
    tempo: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the tempo. Example: 0.73 */
    tempo_confidence: number;
    /** An estimated time signature. Example: 4 */
    time_signature: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the time_signature. Example: 0.994 */
    time_signature_confidence: number;
    /** The key the track is in. Example: 9 */
    key: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the key. Example: 0.408 */
    key_confidence: number;
    /** Mode indicates the modality (major or minor) of a track. Example: 0 */
    mode: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the mode. Example: 0.485 */
    mode_confidence: number;
    /** An Echo Nest Musical Fingerprint (ENMFP) codestring for this track. */
    codestring: string;
    /** A version number for the Echo Nest Musical Fingerprint format used in the codestring field. Example: 3.15 */
    code_version: number;
    /** An EchoPrint codestring for this track. */
    echoprintstring: string;
    /** A version number for the EchoPrint format used in the echoprintstring field. Example: 4.15 */
    echoprint_version: number;
    /** A Synchstring for this track. */
    synchstring: string;
    /** A version number for the Synchstring used in the synchstring field. Example: 1 */
    synch_version: number;
    /** A Rhythmstring for this track. */
    rhythmstring: string;
    /** A version number for the Rhythmstring used in the rhythmstring field. Example: 1 */
    rhythm_version: number;
};

export type SpotifyAudioAnalysisBar = {
    /** The starting point (in seconds) of the time interval. Example: 0.49567 */
    start: number;
    /** The duration (in seconds) of the time interval. Example: 2.18749 */
    duration: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the interval. Example: 0.925 */
    confidence: number;
};

export type SpotifyAudioAnalysisBeat = {
    /** The starting point (in seconds) of the time interval. Example: 0.49567 */
    start: number;
    /** The duration (in seconds) of the time interval. Example: 2.18749 */
    duration: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the interval. Example: 0.925 */
    confidence: number;
};

export type SpotifyAudioAnalysisSection = {
    /** The starting point (in seconds) of the section. Example: 0 */
    start: number;
    /** The duration (in seconds) of the section. Example: 6.97092 */
    duration: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the section's "designation". Example: 1 */
    confidence: number;
    /** The overall loudness of the section in decibels (dB). Example: -14.938 */
    loudness: number;
    /** The overall estimated tempo of the section in beats per minute (BPM). Example: 113.178 */
    tempo: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the tempo. Example: 0.647 */
    tempo_confidence: number;
    /** The estimated overall key of the section. Example: 9 */
    key: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the key. Example: 0.297 */
    key_confidence: number;
    /** Indicates the modality (major or minor) of a section. Example: 0 */
    mode: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the mode. Example: 0.471 */
    mode_confidence: number;
    /** An estimated time signature. Example: 4 */
    time_signature: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the time_signature. Example: 1 */
    time_signature_confidence: number;
};

export type SpotifyAudioAnalysisSegment = {
    /** The starting point (in seconds) of the segment. Example: 0.70154 */
    start: number;
    /** The duration (in seconds) of the segment. Example: 0.19891 */
    duration: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the segmentation. Example: 0.435 */
    confidence: number;
    /** The onset loudness of the segment in decibels (dB). Example: -23.053 */
    loudness_start: number;
    /** The peak loudness of the segment in decibels (dB). Example: -14.25 */
    loudness_max: number;
    /** The segment-relative offset of the segment peak loudness in seconds. Example: 0.07305 */
    loudness_max_time: number;
    /** The offset loudness of the segment in decibels (dB). Example: 0 */
    loudness_end: number;
    /** Pitch content is given by a “chroma” vector. Example: [0.212,0.141,0.294] */
    pitches: number[];
    /** Timbre is the quality of a musical note or sound. Example: [42.115,64.373,-0.233] */
    timbre: number[];
};

export type SpotifyAudioAnalysisTatum = {
    /** The starting point (in seconds) of the time interval. Example: 0.49567 */
    start: number;
    /** The duration (in seconds) of the time interval. Example: 2.18749 */
    duration: number;
    /** The confidence, from 0.0 to 1.0, of the reliability of the interval. Example: 0.925 */
    confidence: number;
};

export type SpotifyAudioAnalysis = {
    /** Metadata about the analysis process. */
    meta: SpotifyAudioAnalysisMeta;
    /** Analysis data for the track. */
    track: SpotifyAudioAnalysisTrack;
    /** The time intervals of the bars throughout the track. */
    bars: SpotifyAudioAnalysisBar[];
    /** The time intervals of beats throughout the track. */
    beats: SpotifyAudioAnalysisBeat[];
    /** Sections are defined by large variations in rhythm or timbre. */
    sections: SpotifyAudioAnalysisSection[];
    /** Each segment contains a roughly consistent sound throughout its duration. */
    segments: SpotifyAudioAnalysisSegment[];
    /** A tatum represents the lowest regular pulse train that a listener intuitively infers from the timing of perceived musical events. */
    tatums: SpotifyAudioAnalysisTatum[];
};
