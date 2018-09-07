//@@../../shared/js/common.js
//@@../../shared/js/WebGLUtils.js

function load() {
    canvas = document.querySelector('canvas');
    gl = WebGLUtils.getContext(canvas, ['webgl', 'experimental-webgl']);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    var success = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    if (!success) {
        throw new Error('Could not compile vertex shader:\n' + gl.getShaderInfoLog(vertexShader));
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    success = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
    if (!success) {
        throw new Error('Could not compile fragment shader:\n' + gl.getShaderInfoLog(fragmentShader));
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        throw new Error('Could not link program:\n' + gl.getProgramInfoLog(program));
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
