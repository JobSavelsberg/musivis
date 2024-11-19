import { drawGraphics } from "@/libs/graphics/graphics";
import { useRef, useLayoutEffect } from "react";

export default function WebGLCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const gl = canvas.getContext("webgl");
            if (!gl) {
                console.error("WebGL not supported");
                return;
            }
            // Set canvas size to match its display size
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            drawGraphics(gl);
        }
    }, []);

    return (
        <canvas ref={canvasRef} width={300} height={300} className="bg-black" />
    );
}
