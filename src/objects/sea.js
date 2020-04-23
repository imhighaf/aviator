const THREE = require('three');
import { colors } from '../constants';

class Sea {
	constructor() {
		// create the geometry (shape) of the cylinder;
		// the parameters are: 
		// radius top, radius bottom, height, number of segments on the radius, number of segments vertically

		const geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);

		// rotate the geometry on the x axis
		geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		// create the material 
		const mat = new THREE.MeshPhongMaterial({
			color: colors.blue,
			transparent: true,
			opacity: .6,
			shading: THREE.FlatShading,
		});
		// To create an object in Three.js, we have to create a mesh 
		// which is a combination of a geometry and some material

		this.mesh = new THREE.Mesh(geom, mat);

		// To create an object in Three.js, we have to create a mesh 
		// which is a combination of a geometry and some material
        this.mesh.receiveShadow = true;
        this.mesh.position.y = -600;
	}
}

const sea = new Sea();


export default sea;