# Musivis

## Project Overview

Musivis is a music visualizer application that leverages the Spotify API to fetch a user's music data, such as top tracks, and then aims to create visualizations based on music structure analysis techniques.

The project is architected as a monorepo containing two main components:

*   **`musivis-api`**: A backend API built with .NET (C#). It handles interactions with the Spotify API that require a backend (e.g., token exchange, potentially sensitive API calls) and will eventually serve processed music analysis data.
*   **`musivis-webclient`**: A frontend web application built with React, TypeScript, and Vite. It provides the user interface for authentication with Spotify, displaying music information, and rendering visualizations.

## Prerequisites

To build, run, and develop Musivis locally, you will need the following tools installed:

*   **.NET SDK**: Version 8.0 or later. (Check with `dotnet --version`)
*   **Node.js**: Current LTS version is recommended. (Check with `node -v`)
*   **npm**: Comes with Node.js. Used for managing frontend dependencies. (Check with `npm -v`)

## API (`musivis-api`)

The backend API service.

**Directory:** `musivis-api/`

### Setup

1.  **Navigate to the API directory:**
    ```bash
    cd musivis-api
    ```
2.  **Restore .NET dependencies:**
    ```bash
    dotnet restore musivis-api.sln
    ```
    (Alternatively, just `dotnet restore` inside the `musivis-api` directory will also work for the solution file present there.)

### Running Locally

1.  **Run the API project:**
    ```bash
    dotnet run --project musivis-api/Musivis.API.csproj
    ```
    Or, navigate to `musivis-api/musivis-api/` and run `dotnet run`.

    The API will typically start on `http://localhost:5113`. By default, it should also launch your browser and navigate to `http://localhost:5113/swagger` for API documentation.

### Testing

1.  **Run the xUnit tests for the API:**
    From the `musivis-api/` directory:
    ```bash
    dotnet test musivis-api.sln
    ```
    Or simply `dotnet test` if you are in the `musivis-api` directory.

### Deployment

*   The API is configured for deployment to **Fly.io**.
*   Configuration can be found in `musivis-api/fly.toml`.
*   Deployment is automated via GitHub Actions, as defined in the `.github/workflows/` directory.

## Web Client (`musivis-webclient`)

The frontend web application.

**Directory:** `musivis-webclient/`

### Setup

1.  **Navigate to the web client directory:**
    ```bash
    cd musivis-webclient
    ```
2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

### Environment Variables

The web client requires Spotify API credentials and the backend URL to function correctly. These are managed via environment variables.

1.  **Template File:** A template for environment variables can be found in `musivis-webclient/.env`. It includes:
    *   `VITE_SPOTIFY_CLIENT_ID`: Your Spotify application's Client ID.
    *   `VITE_SPOTIFY_REDIRECT_URL`: The redirect URI configured in your Spotify application dashboard.
    *   `VITE_MUSIVIS_BACKEND_URL`: The URL where the `musivis-api` is running.

2.  **Local Configuration:**
    *   Create a new file named `.env.local` inside the `musivis-webclient` directory. This file is gitignored and will override the default values for local development.
    *   Populate `musivis-webclient/.env.local` with your actual values:
        ```env
        VITE_SPOTIFY_CLIENT_ID=YOUR_ACTUAL_SPOTIFY_CLIENT_ID
        VITE_SPOTIFY_REDIRECT_URL=http://localhost:5173/login/callback
        VITE_MUSIVIS_BACKEND_URL=http://localhost:5113
        ```
    *   **Important:** Ensure `VITE_SPOTIFY_REDIRECT_URL` matches one of the Redirect URIs you've configured in your Spotify Developer Dashboard for your application (e.g., `http://localhost:5173/login/callback` for local development).

### Running Locally

1.  **Start the Vite development server:**
    ```bash
    npm run dev
    ```
    The web client will typically be available at `http://localhost:5173`.

### Testing

1.  **Run Vitest tests:**
    ```bash
    npm test
    ```
2.  **Run Vitest tests with UI:**
    For an interactive test runner experience:
    ```bash
    npm run test:ui
    ```

### Building for Production

1.  **Build the application for production:**
    ```bash
    npm run build
    ```
    The output will be in the `musivis-webclient/dist` directory.

### Deployment

*   The web client is configured for deployment to **Vercel**.
*   Configuration can be found in `vercel.json` at the root of the repository.
*   Deployment is typically handled automatically by Vercel when changes are pushed to the connected GitHub repository.

## Project Structure

A brief overview of the main directories:

```
.
├── .github/            # GitHub Actions workflows for CI/CD
├── .vscode/            # VS Code workspace settings and recommended extensions
├── musivis-api/        # .NET Backend API
│   ├── musivis-api/    # Main API project (Musivis.API.csproj)
│   │   ├── Controllers/
│   │   ├── Properties/ # Launch settings
│   │   └── ...
│   ├── Musivis.API.Tests/ # xUnit tests for the API
│   ├── musivis-api.sln # .NET Solution file
│   ├── Dockerfile      # Docker configuration for the API
│   └── fly.toml        # Fly.io deployment configuration
├── musivis-webclient/  # React/TypeScript Frontend
│   ├── public/         # Static assets
│   ├── src/            # Source code
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── test/       # Test setup and mocks
│   │   ├── app.tsx     # Main application component
│   │   └── main.tsx    # Entry point
│   ├── index.html      # Main HTML file
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── .gitignore
├── README.md           # This file
└── vercel.json         # Vercel deployment configuration for the monorepo
```

This structure helps separate concerns between the backend and frontend, while keeping them in a single repository for easier management.
