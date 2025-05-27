import { SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { Card, CardContent } from "./card";
import { cn } from "@/libs/utils";
import { Play } from "lucide-react";

export default function TrackCard({
    track,
    className,
    onClick,
    tabIndex,
}: {
    track: SpotifyTrack;
    className?: string;
    onClick?: () => void;
    tabIndex?: number;
}) {
    // Add defensive check for album images with fallback
    const coverUrl =
        track.album?.images &&
        track.album.images.length > 0 &&
        track.album.images[0]?.url
            ? track.album.images[0].url
            : "https://placehold.co/400x400/333/white?text=No+Image";

    const title = track.name || "Unknown Title";
    const artists =
        track.artists?.length > 0
            ? track.artists
                  .map((artist) => artist.name || "Unknown Artist")
                  .join(", ")
            : "Unknown Artist";

    return (
        <Card
            tabIndex={tabIndex}
            className={cn(
                "overflow-hidden cursor-pointer hover:bg-accent transition-colors focus-visible:ring-2 focus:ring-2",
                className,
            )}
            onClick={onClick}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    onClick?.();
                }
            }}
        >
            <div className="relative pb-[100%] overflow-hidden group">
                <img
                    src={coverUrl}
                    alt={`Cover art for ${title} by ${artists}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-150 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <Play />
                </div>
            </div>
            <CardContent className="p-2">
                <h3 className="text-center text-sm font-semibold truncate">
                    {title}
                </h3>
                <p className="text-center text-xs truncate text-muted-foreground">
                    {artists}
                </p>
            </CardContent>
        </Card>
    );
}
