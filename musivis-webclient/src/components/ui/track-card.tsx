import { SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { Card, CardContent } from "./card";
import { cn } from "@/libs/utils";

export default function TrackCard({
    track,
    className,
    onClick,
}: {
    track: SpotifyTrack;
    className?: string;
    onClick?: () => void;
}) {
    const coverUrl = track.album.images[0].url;
    const title = track.name;
    const artists = track.artists.map((artist) => artist.name).join(", ");

    return (
        <Card
            className={cn(
                "overflow-hidden cursor-pointer hover:bg-accent transition-colors",
                className,
            )}
            onClick={onClick}
        >
            <div className="relative pb-[100%]">
                <img
                    src={coverUrl}
                    alt={`Cover art for ${title} by ${artists}`}
                    className="absolute inset-0 h-full w-full object-cover"
                />
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
