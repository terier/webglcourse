//@@../../shared/js/common.js
//@@../../shared/js/WebGLUtils.js

var uTime;
var timeStart;

function load() {
    canvas = document.querySelector('canvas');
    gl = WebGLUtils.getContext(canvas, ['webgl', 'experimental-webgl']);

    var programs = WebGLUtils.compileShaders(gl, {
        test: {
            vertex: vertexShaderSource,
            fragment: fragmentShaderSource
        }
    });
    gl.useProgram(programs.test.program);

    var data = new Float32Array([
        -0.5, -0.5, 0.0, 1.0,  1.0, 0.0, 0.0, 1.0,
        0.5, -0.5, 0.0, 1.0,   0.0, 1.0, 0.0, 1.0,
        0.0, 0.5, 0.0, 1.0,    0.0, 0.0, 1.0, 1.0
    ]);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var aPosition = programs.test.attributes.aPosition;
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 32, 0);

    var aColor = programs.test.attributes.aColor;
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 32, 16);

    uTime = programs.test.uniforms.uTime;
    timeStart = Date.now();
}

function animate() {
    if (gl) {
        gl.uniform1f(uTime, (Date.now() - timeStart) * 0.005);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

var vertexShaderSource = `
attribute vec4 aPosition;
attribute vec4 aColor;

varying vec4 vColor;

uniform float uTime;

void main() {
    gl_Position = aPosition + vec4(cos(uTime), sin(uTime), 0.0, 0.0) * 0.2;
    vColor = aColor;
}
`.trim();

var fragmentShaderSource = `
precision mediump float;

varying vec4 vColor;

void main() {
    gl_FragColor = vColor;
}
`.trim();
