import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "../theme-provider";
import { User } from "@/app";

export type ProfileProps = {
    user: User | null;
    onLogOut: () => void;
};

export default function Profile({ user, onLogOut }: ProfileProps) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
        // Here you would typically update the theme in your app's context or localStorage
    };

    if (!user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.images[0].url} alt="@username" />
                        <AvatarFallback>{user.display_name}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user.display_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggleTheme}>
                    {theme === "light" ? (
                        <Moon className="mr-2 h-4 w-4" />
                    ) : (
                        <Sun className="mr-2 h-4 w-4" />
                    )}
                    <span>
                        Toggle {theme === "light" ? "Dark" : "Light"} Mode
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
