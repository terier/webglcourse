//@@../../shared/js/common.js
//@@../../shared/js/WebGLUtils.js

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

    // create position data & buffer

    // create attribute
}

function animate() {
    if (gl) {
        // draw!
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

void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`.trim();
