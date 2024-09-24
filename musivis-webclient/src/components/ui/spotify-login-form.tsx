import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SpotifyAuthorization } from "@/services/spotify/spotifyAuthorization";

export function SpotifyLoginForm() {
    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Use your Spotify account to visualize and play your music
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <Button
                        type="submit"
                        className="w-full"
                        onClick={() => SpotifyAuthorization.authorize()}
                    >
                        Login with Spotify
                    </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Button variant="link">Sign up</Button>
                </div>
            </CardContent>
        </Card>
    );
}
