import {colors} from './constants'
const THREE = require('three');

import './css/main.css';
import sea from './objects/sea';
import sky from './objects/sky';
import airplane from './objects/airplane';
import CameraBuilder from './scene/camera'

// console.log(cam.getSettings())
//aspectRatio = WIDTH / HEIGHT;
	//fieldOfView = 60;
	//nearPlane = 1;
	//farPlane = 10000;
let scene,
	camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
	renderer, container;

let mousePos = {x: 0, y: 0}

window.addEventListener('load', init, false);

function init() {
	console.log('init')
	// set up the scene, the camera and the renderer
	createScene();

	// add the lights
	createLights();

	// // add the objects
	//createPlane();
	//createSea();
	scene.add(sea.mesh);
	scene.add(sky.mesh);
	scene.add(airplane.mesh);
	//createSky();

	// // start a loop that will update the objects' positions 
	// // and render the scene on each frame
	document.addEventListener('mousemove', handleMouseMove, false);
	loop();
	//renderer.render(scene, camera);
}

function loop () {
	// Rotate the propeller, the sea and the sky
	airplane.propeller.rotation.x += 0.3;
	sea.mesh.rotation.z += .005;
	sky.mesh.rotation.z += .01;
	updatePlane();
	// render the scene
	renderer.render(scene, camera);
	console.log(airplane)
	airplane.pilot.updateHairs();
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
	
	camera = CameraBuilder.perspectiveCamera(60, WIDTH / HEIGHT, 1, 10000);
	// Set the position of the camera
	CameraBuilder.setPosition(camera, {x: 0, y: 100, z: 200})
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

////// handle resize

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}


function handleMouseMove(event) {

	// here we are converting the mouse position value received 
	// to a normalized value varying between -1 and 1;
	// this is the formula for the horizontal axis:
	
	var tx = -1 + (event.clientX / WIDTH)*2;
	console.log(tx)
	// for the vertical axis, we need to inverse the formula 
	// because the 2D y-axis goes the opposite direction of the 3D y-axis
	
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

}

function updatePlane(){

	// let's move the airplane between -100 and 100 on the horizontal axis, 
	// and between 25 and 175 on the vertical axis,
	// depending on the mouse position which ranges between -1 and 1 on both axes;
	// to achieve that we use a normalize function (see below)
	
	var targetX = normalize(mousePos.x, -1, 1, -100, 100);
	var targetY = normalize(mousePos.y, -1, 1, 25, 175);

	// update the airplane's position
	airplane.mesh.position.y = targetY;
	airplane.mesh.position.x = targetX;
	airplane.propeller.rotation.x += 0.3;
}

function normalize(v,vmin,vmax,tmin, tmax){

	var nv = v//Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;

}