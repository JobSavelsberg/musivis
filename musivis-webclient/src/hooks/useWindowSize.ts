import { useState, useEffect } from "react";

interface WindowSize {
    width: number;
    height: number;
}

export function useWindowSize(): WindowSize {
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return windowSize;
}
