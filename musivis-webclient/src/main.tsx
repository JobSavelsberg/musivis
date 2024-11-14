import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import AuthProvider from "./components/auth-provider.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./routes/error-fallback.tsx";
import { ThemeProvider } from "./contexts/themeContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
            <BrowserRouter>
                <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>,
);
