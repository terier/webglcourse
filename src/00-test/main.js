//@@../../shared/js/common.js
//@@../../shared/js/WebGLUtils.js

function load() {
    canvas = document.querySelector('canvas');
    gl = WebGLUtils.getContext(canvas, ['webgl', 'experimental-webgl'], {
        alpha: false
    });
}

function animate() {
    if (gl) {
        gl.clearColor(Math.random(), 0.0, 0.0, 1.0);
        //gl.clear(gl.COLOR_BUFFER_BIT);
    }
}
