var canvas = null;
var gl = null;

function frame() {
    if (canvas) {
        var width = window.innerWidth; // canvas.clientWidth;
        var height = window.innerHeight; // canvas.clientHeight;
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            if (gl) {
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
            }
        }
    }
    if (typeof animate !== 'undefined') {
        animate();
    }
    requestAnimationFrame(frame);
}

window.addEventListener('load', load);
requestAnimationFrame(frame);
