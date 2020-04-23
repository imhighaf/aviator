const THREE = require('three');

class Camera {
    static perspectiveCamera (fov = 60, aspect= 1.07, near =1, far = 10000) {
        return new THREE.PerspectiveCamera(
            fov,
            aspect,
            near,
            far
        );
    }
    static setPosition (cam, coords) {
        cam.position.x = coords.x;
        cam.position.y = coords.y;
        cam.position.z = coords.z
        return cam;
    }
}

export default Camera;