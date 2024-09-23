import { SpotifyTrack } from "@/services/spotify/spotifyDTOs";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

export default function TrackCard({ track, className }: { track: SpotifyTrack; className?: string }) {
    const coverUrl = track.album.images[0].url;
    const title = track.name;
    const artists = track.artists.map((artist) => artist.name).join(", ");

    return (
    <Card className={cn("overflow-hidden cursor-pointer hover:bg-accent transition-colors", className)}>
      <div className="relative pb-[100%]">
        <img
          src={coverUrl}
          alt={`Cover art for ${title} by ${artists}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <CardContent className="p-4 bg-black bg-opacity-75">
        <h3 className="text-center text-sm font-semibold text-white truncate">{title}</h3>
        <p className="text-center text-xs text-gray-300 truncate">
          {artists}
        </p>
      </CardContent>
    </Card>
    )
}