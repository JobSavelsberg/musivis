import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/libs/utils";

const Seeker = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
    const [showThumb, setShowThumb] = React.useState(false);

    return (
        <SliderPrimitive.Root
            ref={ref}
            className={cn(
                "relative flex w-full touch-none select-none items-center cursor-pointer",
                className,
            )}
            onMouseEnter={() => setShowThumb(true)}
            onMouseLeave={() => setShowThumb(false)}
            {...props}
        >
            <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full" />
            </SliderPrimitive.Track>
            {/* move to the left by w-2 */}
            <div className="absolute h-4 -left-2 -right-2">
                <SliderPrimitive.Thumb
                    onFocus={() => setShowThumb(true)}
                    onBlur={() => setShowThumb(false)}
                    className={
                        "block h-4 w-4 rounded-full bg-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" +
                        (showThumb ? " opacity-100" : " opacity-0")
                    }
                />
            </div>
        </SliderPrimitive.Root>
    );
});
Seeker.displayName = "Seeker";

export { Seeker };
