import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { FallbackProps } from "react-error-boundary";

export default function ErrorFallback({
    error,
    resetErrorBoundary,
}: FallbackProps) {
    console.error(error);

    return (
        <div className="min-h-screen flex flex-col gap-8 items-center justify-center p-4 text-center">
            <AlertTriangle
                className="h-16 w-16 text-destructive"
                aria-hidden="true"
            />
            <h1 className="text-4xl font-bold">Oops! Something went wrong</h1>
            <p className="text-muted-foreground max-w-md">
                We're sorry, but an error occurred while processing your
                request. Our team has been notified and is working on a
                solution.
            </p>
            <div className="space-x-4">
                <Button onClick={resetErrorBoundary} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                    Try again
                </Button>
                <Button onClick={() => (window.location.href = "/")}>
                    <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                    Go to homepage
                </Button>
            </div>
            <p className="text-sm text-muted-foreground">
                If the problem persists, please contact our{" "}
                <a
                    href="/support"
                    className="font-medium text-primary hover:underline"
                >
                    support team
                </a>
                .
            </p>
        </div>
    );
}
