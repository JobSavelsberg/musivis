import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock fetch
global.fetch = vi.fn((input: RequestInfo | URL) => {
    // Log the URL being fetched for debugging
    // console.log(`Mock fetch called for URL: ${input.toString()}`);

    // Default mock headers
    const mockHeaders = new Headers({
        "Content-Type": "application/json",
    });

    // Default mock response
    let mockResponseData: unknown = {};
    const mockStatus = 200;
    const mockOk = true;
    const mockStatusText = "OK";

    // Customize response based on URL if needed for specific tests
    if (input.toString().includes("/status")) {
        mockResponseData = "Mocked status"; // Text response
        mockHeaders.set("Content-Type", "text/plain");
    } else if (input.toString().includes("api.spotify.com")) {
        // Example: Specific mock for Spotify API calls
        if (input.toString().includes("/v1/me/top/tracks")) {
            mockResponseData = { items: [] }; // Example for getTopTracks
        } else if (input.toString().includes("/v1/me")) {
            mockResponseData = {
                display_name: "Mock User",
                id: "mockid",
                email: "mock@example.com",
                images: [],
            }; // Example for getMe
        } else if (input.toString().includes("/v1/search")) {
            mockResponseData = { tracks: { items: [] } }; // Example for search
        }
        // Add other specific Spotify endpoints as needed
    }

    const res = {
        headers: mockHeaders,
        ok: mockOk,
        status: mockStatus,
        statusText: mockStatusText,
        json: () => Promise.resolve(mockResponseData),
        text: () =>
            Promise.resolve(
                typeof mockResponseData === "string"
                    ? mockResponseData
                    : JSON.stringify(mockResponseData),
            ),
        clone: () => ({ ...res }), // Basic clone implementation
    } as Response; // Cast to Response

    return Promise.resolve(res);
});

// Mock localStorage
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        key: (index: number) => Object.keys(store)[index] || null,
        get length() {
            return Object.keys(store).length;
        },
    };
})();

Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
});

// Set a default token for tests that might need it
localStorageMock.setItem("access_token", "mock_access_token");
// For SpotifyAuthorization.isLoggingIn()
localStorageMock.setItem("isLoggingIn", "false");
