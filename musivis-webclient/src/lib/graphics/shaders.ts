export const vertexShaderSource = `
                attribute vec4 a_position;
                attribute vec4 a_color;
                varying vec4 v_color;
                void main() {
                    gl_Position = a_position;
                    v_color = a_color;
                }
            `;
export const fragmentShaderSource = `
    precision mediump float;
    varying vec4 v_color;
    void main() {
        gl_FragColor = v_color;
    }
`;

export function importShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader  {
    const shader = gl.createShader(type);
    if (shader) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
    } else {
        throw new Error("Failed to create shader");
    }
    return shader;
}