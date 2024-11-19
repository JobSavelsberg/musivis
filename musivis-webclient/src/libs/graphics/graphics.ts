import { fragmentShaderSource, importShader, vertexShaderSource } from "./shaders";

export function drawGraphics(gl: WebGLRenderingContext) {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Initialize WebGL context and set up drawing here
    const vertexShader = importShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = importShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    if (program) {
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
    } else {
        console.error("Failed to create program");
        return;
    }

    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([0, 1, 0, -1, -1, 0, 1, -1, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const colors = new Float32Array([
        1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(
        program,
        "a_position",
    );

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program, "a_color");
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}