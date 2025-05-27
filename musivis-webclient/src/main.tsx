import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { StrictMode } from "react";
import AuthProvider from "./components/auth-provider.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./routes/error-fallback.tsx";
import { ThemeProvider } from "./contexts/themeContext.tsx";
import CookieConsent from "react-cookie-consent";
import { initializeAppIfNeeded } from "./firebase.ts";

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
        <CookieConsent
            location="bottom"
            buttonText="Sure, man!"
            cookieName="myAwesomeCookieName2"
            style={{ background: "#2B373B" }}
            buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
            expires={150}
            onAccept={() => {
                initializeAppIfNeeded();
            }}
        >
            This website uses cookies to enhance the user experience.{" "}
            <span style={{ fontSize: "10px" }}>
                (Actually, it's just for some analytics, but let's pretend it's for something grander!)
            </span>
        </CookieConsent>
    </StrictMode>,
);
