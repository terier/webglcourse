//@@../../shared/js/common.js
//@@../../shared/js/WebGLUtils.js

var timeStart;
var triangleBuffer;
var quadBuffer;
var texture;
var programs;
var framebuffer;
var framebufferTexture;
var framebufferWidth = 64;
var framebufferHeight = 64;

function load() {
    canvas = document.querySelector('canvas');
    gl = WebGLUtils.getContext(canvas, ['webgl', 'experimental-webgl']);

    timeStart = Date.now();

    // create and compile programs
    programs = WebGLUtils.compileShaders(gl, {
        triangle: {
            vertex: triangleVSS,
            fragment: triangleFSS
        },
        quad: {
            vertex: quadVSS,
            fragment: quadFSS
        }
    });

    // load and create texture
    var image = new Image();
    image.addEventListener('load', function() {
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    });
    image.src = 'cat.jpg';

    // create framebuffer
    framebuffer = gl.createFramebuffer();
    framebufferTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, framebufferTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebufferWidth, framebufferHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebufferTexture, 0);

    // create triangle buffer
    var triangleData = new Float32Array([
        -0.5, -0.5, 0.0, 1.0,  1.0, 0.0, 0.0, 1.0,  0.0, 0.0,
        0.5, -0.5, 0.0, 1.0,   0.0, 1.0, 0.0, 1.0,  1.0, 0.0,
        0.0, 0.5, 0.0, 1.0,    0.0, 0.0, 1.0, 1.0,  1.0, 1.0
    ]);
    triangleBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleData, gl.STATIC_DRAW);

    // create quad buffer
    quadBuffer = WebGLUtils.createClipQuad(gl);
}

function animate() {
    if (gl && texture) {
        // draw triangle
        gl.useProgram(programs.triangle.program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.viewport(0, 0, framebufferWidth, framebufferHeight);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // setup buffers, attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);

        var aPosition = programs.triangle.attributes.aPosition;
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 40, 0);

        var aColor = programs.triangle.attributes.aColor;
        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 40, 16);

        var aTexCoord = programs.triangle.attributes.aTexCoord;
        gl.enableVertexAttribArray(aTexCoord);
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 40, 32);

        // setup uniforms
        var time = (Date.now() - timeStart) * 0.005;
        gl.uniform1f(programs.triangle.uniforms.uTime, time);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(programs.triangle.uniforms.uTexture, 0);

        // draw!
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // draw quad
        gl.useProgram(programs.quad.program);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        // setup buffers, attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);

        var aPosition = programs.quad.attributes.aPosition;
        gl.enableVertexAttribArray(aPosition);
        gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

        // setup uniforms
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, framebufferTexture);
        gl.uniform1i(programs.quad.uniforms.uTexture, 0);

        // draw!
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }
}

var triangleVSS = `
attribute vec4 aPosition;
attribute vec4 aColor;
attribute vec2 aTexCoord;

varying vec4 vColor;
varying vec2 vTexCoord;

uniform float uTime;

void main() {
    gl_Position = aPosition + vec4(cos(uTime), sin(uTime), 0.0, 0.0) * 0.2;
    vColor = aColor;
    vTexCoord = aTexCoord;
}
`.trim();

var triangleFSS = `
precision mediump float;

varying vec4 vColor;
varying vec2 vTexCoord;

uniform sampler2D uTexture;

void main() {
    gl_FragColor = texture2D(uTexture, vTexCoord) * vColor;
}
`.trim();

var quadVSS = `
attribute vec2 aPosition;

varying vec2 vTexCoord;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vTexCoord = (aPosition + 1.0) * 0.5;
}
`.trim();

var quadFSS = `
precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;

void main() {
    gl_FragColor = texture2D(uTexture, vTexCoord);
}
`.trim();
