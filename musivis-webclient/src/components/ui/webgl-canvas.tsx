import { useRef, useEffect } from "react";

export default function WebGLCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const gl = canvas.getContext("webgl");
            if (!gl) {
                console.error("WebGL not supported");
                return;
            }
            // Initialize WebGL context and set up drawing here
            // ...existing code...
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            // style={{ width: "100%", height: "100%" }}
            className="bg-black"
        />
    );
}
