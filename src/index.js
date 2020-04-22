import colors from './js/colors'
const THREE = require('three');

let scene,
	camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
	renderer, container;

window.addEventListener('load', init, false);

function init() {
	console.log('init')
	// set up the scene, the camera and the renderer
	createScene();

	// add the lights
	createLights();

	// // add the objects
	createPlane();
	createSea();
	createSky();

	// // start a loop that will update the objects' positions 
	// // and render the scene on each frame
	loop();
}

function loop () {
	// Rotate the propeller, the sea and the sky
	airplane.propeller.rotation.x += 0.3;
	sea.mesh.rotation.z += .005;
	sky.mesh.rotation.z += .01;

	// render the scene
	renderer.render(scene, camera);

	// call the loop function again
	requestAnimationFrame(loop);
}

function createScene() {
	// Get the width and the height of the screen,
	// use them to set up the aspect ratio of the camera
	// and the size of the renderer.
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	scene = new THREE.Scene();
	// Add a fog effect to the scene; same color as the
	// background color used in the style sheet
	scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

	// Create the camera
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
	);

	// Set the position of the camera
	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 100;

	// Create the renderer
	renderer = new THREE.WebGLRenderer({
		// Allow transparency to show the gradient background
		// we defined in the CSS
		alpha: true,
		// Activate the anti-aliasing; this is less performant,
		// but, as our project is low-poly based, it should be fine :)
		antialias: true,
	})

	// Define the size of the renderer; in this case,
	// it will fill the entire screen
	renderer.setSize(WIDTH, HEIGHT);

	// Enable shadow rendering
	renderer.shadowMap.enabled = true;

	// Add the DOM element of the renderer to the 
	// container we created in the HTML
	container = document.getElementById('world');
	container.appendChild(renderer.domElement);

	// Listen to the screen: if the user resizes it
	// we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);

}


/////////////// create Lights
let hemisphereLight, shadowLight;

function createLights() {
	// A hemisphere light is a gradient colored light; 
	// the first parameter is the sky color, the second parameter is the ground color, 
	// the third parameter is the intensity of the light
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);
	// A directional light shines from a specific direction. 
	// It acts like the sun, that means that all the rays produced are parallel. 
	shadowLight = new THREE.DirectionalLight(0xffffff, .9);
	// Set the direction of the light  
	shadowLight.position.set(150, 350, 350);

	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;


	scene.add(hemisphereLight);
	scene.add(shadowLight);

}

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
	}
}

////create sea
let sea;

function createSea() {
	sea = new Sea();
	console.log(sea)
	// push it a little bit at the bottom of the scene
	sea.mesh.position.y = -600;

	// add the mesh of the sea to the scene
	scene.add(sea.mesh);
}

//crearte clouds


class Cloud {
	constructor() {
		// Create an empty container that will hold the different parts of the cloud
		this.mesh = new THREE.Object3D();

		// create a cube geometry;
		// this shape will be duplicated to create the cloud
		var geom = new THREE.BoxGeometry(20, 20, 20);
		// create a material; a simple white material will do the trick
		var mat = new THREE.MeshPhongMaterial({
			color: colors.white,
		});

		// duplicate the geometry a random number of times
		var nBlocs = 3 + Math.floor(Math.random() * 3);

		for (let i = 0; i < nBlocs; i++) {

			// create the mesh by cloning the geometry
			let m = new THREE.Mesh(geom, mat);

			// set the position and the rotation of each cube randomly
			m.position.x = i * 15;
			m.position.y = Math.random() * 10;
			m.position.z = Math.random() * 10;
			m.rotation.z = Math.random() * Math.PI * 2;
			m.rotation.y = Math.random() * Math.PI * 2;

			// set the size of the cube randomly
			var s = .1 + Math.random() * .9;
			m.scale.set(s, s, s);

			// allow each cube to cast and to receive shadows
			m.castShadow = true;
			m.receiveShadow = true;

			// add the cube to the container we first created
			this.mesh.add(m);
		}
	}
}

class Sky {
	constructor() {
		// Create an empty container
		this.mesh = new THREE.Object3D();
		// choose a number of clouds to be scattered in the sky
		this.nClouds = 20;

		for (let i = 0; i < this.nClouds; i++) {
			const c = new Cloud();
			// To distribute the clouds consistently,
			// we need to place them according to a uniform angle
			const stepAngle = Math.PI * 2 / this.nClouds;

			// set the rotation and the position of each cloud;
			// for that we use a bit of trigonometry
			const a = stepAngle * i; // this is the final angle of the cloud
			const h = 750 + Math.random() * 200; // this is the distance between the center of the axis and the cloud itself

			// Trigonometry!!! I hope you remember what you've learned in Math :)
			// in case you don't: 
			// we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
			c.mesh.position.y = Math.sin(a) * h;
			c.mesh.position.x = Math.cos(a) * h;

			// rotate the cloud according to its position
			c.mesh.rotation.z = a + Math.PI / 2;

			// for a better result, we position the clouds 
			// at random depths inside of the scene
			c.mesh.position.z = -400 - Math.random() * 400;

			// we also set a random scale for each cloud
			var s = 1 + Math.random() * 2;
			c.mesh.scale.set(s, s, s);

			// do not forget to add the mesh of each cloud in the scene
			this.mesh.add(c.mesh);

		}
	}
}

let sky;

function createSky() {
	sky = new Sky();
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
}

/////create plane

class AirPlane {
	constructor() {
		this.mesh = new THREE.Object3D();
		// Create the cabin
		const geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
		const matCockpit = new THREE.MeshPhongMaterial({
			color: colors.red,
			shading: THREE.FlatShading
		});
		const cockpit = new THREE.Mesh(geomCockpit, matCockpit);
		cockpit.castShadow = true;
		cockpit.receiveShadow = true;
		this.mesh.add(cockpit);

		// Create the engine
		const geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
		const matEngine = new THREE.MeshPhongMaterial({
			color: colors.white,
			shading: THREE.FlatShading
		});
		const engine = new THREE.Mesh(geomEngine, matEngine);
		engine.position.x = 40;
		engine.castShadow = true;
		engine.receiveShadow = true;
		this.mesh.add(engine);

		// Create the tail
		const geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
		const matTailPlane = new THREE.MeshPhongMaterial({
			color: colors.red,
			shading: THREE.FlatShading
		});
		const tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
		tailPlane.position.set(-35, 25, 0);
		tailPlane.castShadow = true;
		tailPlane.receiveShadow = true;
		this.mesh.add(tailPlane);

		// Create the wing
		const geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
		const matSideWing = new THREE.MeshPhongMaterial({
			color: colors.red,
			shading: THREE.FlatShading
		});
		const sideWing = new THREE.Mesh(geomSideWing, matSideWing);
		sideWing.castShadow = true;
		sideWing.receiveShadow = true;
		this.mesh.add(sideWing);

		// propeller
		const geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
		const matPropeller = new THREE.MeshPhongMaterial({ 
			color: colors.brown, 
			shading: THREE.FlatShading 
		});
		this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
		this.propeller.castShadow = true;
		this.propeller.receiveShadow = true;

		// blades
		const geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
		const matBlade = new THREE.MeshPhongMaterial({ 
			color: colors.brownDark, 
			shading: THREE.FlatShading 
		});

		const blade = new THREE.Mesh(geomBlade, matBlade);
		blade.position.set(8, 0, 0);
		blade.castShadow = true;
		blade.receiveShadow = true;
		this.propeller.add(blade);
		this.propeller.position.set(50, 0, 0);
		this.mesh.add(this.propeller);
	}
}

let airplane;

function createPlane() {
	airplane = new AirPlane();
	airplane.mesh.scale.set(.25, .25, .25);
	airplane.mesh.position.y = 100;
	scene.add(airplane.mesh);
}

////// handle resize

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}
