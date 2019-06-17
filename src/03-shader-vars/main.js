//@@../../shared/js/common.js
//@@../../shared/js/WebGLUtils.js

var programs;
var start = Date.now();
var texture;

function load() {
    canvas = document.querySelector('canvas');
    gl = WebGLUtils.getContext(canvas, ['webgl', 'experimental-webgl']);

    programs = WebGLUtils.compileShaders(gl, {
        test: {
            vertex: vertexShaderSource,
            fragment: fragmentShaderSource
        }
    });
    gl.useProgram(programs.test.program);

    var data = new Float32Array([
        -0.5, -0.5, 0.0, 1.0,  1.0, 0.0, 0.0, 1.0,  0.0, 0.0,
        0.5, -0.5, 0.0, 1.0,   0.0, 1.0, 0.0, 1.0,  1.0, 0.0,
        0.0, 0.5, 0.0, 1.0,    0.0, 0.0, 1.0, 1.0,  1.0, 1.0
    ]);

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var aPosition = programs.test.attributes.aPosition;
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 40, 0);

    var aColor = programs.test.attributes.aColor;
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 40, 16);

    var aTexCoord = programs.test.attributes.aTexCoord;
    gl.enableVertexAttribArray(aTexCoord);
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 40, 32);

    var image = new Image;
    image.onload = function() {
        texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    image.src = 'cat.jpg';

    gl.uniform1i(programs.test.uniforms.uTexture, 0);
}

function animate() {
    if (gl && texture) {
        var t = (Date.now() - start) * 0.005;
        gl.uniform1f(programs.test.uniforms.uTime, t);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(programs.test.uniforms.uTexture, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

var vertexShaderSource = `
attribute vec4 aPosition;
attribute vec4 aColor;
attribute vec2 aTexCoord;

uniform float uTime;

varying vec4 vColor;
varying vec2 vTexCoord;

void main() {
    gl_Position = aPosition;
    vColor = aColor + vec4(sin(uTime), 0.5, 0.0, 0.0);
    vTexCoord = aTexCoord;
}
`.trim();

var fragmentShaderSource = `
precision mediump float;

uniform sampler2D uTexture;

varying vec4 vColor;
varying vec2 vTexCoord;

void main() {
    gl_FragColor = texture2D(uTexture, vTexCoord) * vColor;
}
`.trim();
