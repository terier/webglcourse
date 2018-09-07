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

    var data = new Float32Array([
        -0.5, -0.5, 0.0, 1.0,
        0.5, -0.5, 0.0, 1.0,
        0.0, 0.5, 0.0, 1.0
    ]);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var aPosition = programs.test.attributes.aPosition;
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
}

function animate() {
    if (gl) {
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

void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`.trim();
