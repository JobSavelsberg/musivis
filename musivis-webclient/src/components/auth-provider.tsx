import { User } from "@/app";
import { SpotifyRepository } from "@/services/spotify/spotifyRepository";
import { SpotifyAuthorization } from "@/services/spotify/spotifyAuthorization";
import { createContext, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface IAuthContext {
    isLoggedIn: boolean;
    goToSpotifyAuth: () => void;
    login: () => void;
    logout: () => void;
    user: User;
}

const defaultUser: User = {
    display_name: "",
    email: "",
    id: "",
    images: [],
};

export const AuthContext = createContext<IAuthContext>({
    isLoggedIn: false,
    goToSpotifyAuth: () => {},
    login: () => {},
    logout: () => {},
    user: defaultUser,
});

export interface IAuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider = (props: IAuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<User>(defaultUser);
    const navigate = useNavigate();

    const goToSpotifyAuth = () => {
        SpotifyAuthorization.authorize();
    };

    const logout: IAuthContext["logout"] = useCallback(() => {
        setIsLoggedIn(false);
        setUser(defaultUser);
        SpotifyAuthorization.logOut();
    }, []);

    // Can be called when everything in SpotifyAuthorization is set (token is retrieved and in local storage)
    const login: IAuthContext["login"] = useCallback(() => {
        setIsLoggedIn(true);
        SpotifyRepository.getMe()
            .then((user) => {
                setUser(user);
            })
            .catch(() => {
                // apparently the token is invalid, so we log out
                logout();
            });
    }, [logout]);

    useEffect(() => {
        const isAlreadyLoggedIn = SpotifyAuthorization.isLoggedIn();
        const isLoggingIn = localStorage.getItem("isLoggingIn") === "true";
        if (isAlreadyLoggedIn) {
            // Make sure all login things are set
            login();
        } else if (!isLoggingIn) {
            navigate("/login");
        }
    }, [login, navigate]);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                goToSpotifyAuth,
                login,
                user,
                logout,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
