//@@../../shared/js/common.js

function load() {
    canvas = document.querySelector('canvas');
    gl = canvas.getContext('webgl');
    gl.clearColor(0.5, 0.7, 0.9, 1.0);
}

function animate() {
    gl.clear(gl.COLOR_BUFFER_BIT);
}
