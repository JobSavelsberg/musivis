import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delayMilliseconds: number): T {
    const [debounceValue, setDebounceValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value);
        }, delayMilliseconds);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delayMilliseconds]);
    return debounceValue;
}
