//@@../../shared/js/common.js
//@@../../shared/js/WebGLUtils.js

var program;
var startTime = Date.now();

function load() {
    canvas = document.querySelector('canvas');
    gl = WebGLUtils.getContext(canvas, ['webgl', 'experimental-webgl']);

    var vertexShader = WebGLUtils.createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    var fragmentShader = WebGLUtils.createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    program = WebGLUtils.createProgram(gl, [vertexShader, fragmentShader]);

    gl.useProgram(program.program);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    var data = new Float32Array([
        -1, -1, 0, 1,
        1, -1, 0, 1,
        0, 1, 0, 1
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(program.attributes.aPosition);
    gl.vertexAttribPointer(program.attributes.aPosition, 4, gl.FLOAT, false, 0, 0);
}

function animate() {
    if (gl) {
        var t = (Date.now() - startTime) * 0.005;
        gl.uniform4f(program.uniforms.uColor, Math.abs(Math.cos(t)), 0.0, 0.0, 1.0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

var vertexShaderSource = `
attribute vec4 aPosition;

void main() {
    gl_Position = aPosition;
}
`.trim();

var fragmentShaderSource = `
precision mediump float;

uniform vec4 uColor;

void main() {
    gl_FragColor = uColor;
}
`.trim();
