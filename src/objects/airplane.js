const THREE = require('three');
import { colors } from '../constants';
import pilot from './pilot';

class Cockpit {
    constructor() {
        const geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
        geomCockpit.vertices[4].y -= 10;
        geomCockpit.vertices[4].z += 20;
        geomCockpit.vertices[5].y -= 10;
        geomCockpit.vertices[5].z -= 20;
        geomCockpit.vertices[6].y += 30;
        geomCockpit.vertices[6].z += 20;
        geomCockpit.vertices[7].y += 30;
        geomCockpit.vertices[7].z -= 20;
        const matCockpit = new THREE.MeshPhongMaterial({
            color: colors.red,
            shading: THREE.FlatShading
        });
        this.mesh = new THREE.Mesh(geomCockpit, matCockpit);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}

class Engine {
    constructor() {
        const geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);

        const matEngine = new THREE.MeshPhongMaterial({
            color: colors.white,
            shading: THREE.FlatShading
        });
        this.mesh = new THREE.Mesh(geomEngine, matEngine);
        this.mesh.position.x = 40;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}

class Tail {
    constructor() {
        const geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
        const matTailPlane = new THREE.MeshPhongMaterial({
            color: colors.red,
            shading: THREE.FlatShading
        });
        this.mesh = new THREE.Mesh(geomTailPlane, matTailPlane);
        this.mesh.position.set(-35, 25, 0);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}

class Wing {
    constructor() {
        const geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
        const matSideWing = new THREE.MeshPhongMaterial({
            color: colors.red,
            shading: THREE.FlatShading
        });
        this.mesh = new THREE.Mesh(geomSideWing, matSideWing);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}

class Blade {
    constructor() {
        const geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
        const matBlade = new THREE.MeshPhongMaterial({
            color: colors.brownDark,
            shading: THREE.FlatShading
        });

        this.mesh = new THREE.Mesh(geomBlade, matBlade);
        this.mesh.position.set(8, 0, 0);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}

class Propeller {
    constructor() {
        const geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
        const matPropeller = new THREE.MeshPhongMaterial({
            color: colors.brown,
            shading: THREE.FlatShading
        });
        this.mesh = new THREE.Mesh(geomPropeller, matPropeller);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}


class AirPlane {
    constructor() {
        this.mesh = new THREE.Object3D();
        // Create the cabin
        const cockpit = new Cockpit();
        this.mesh.add(cockpit.mesh);
        // console.log(this.mesh.children[0])

        // Create the engine
        const engine = new Engine();
        this.mesh.add(engine.mesh);

        // Create the tail
        const tailPlane = new Tail();
        this.mesh.add(tailPlane.mesh);

        // Create the wing
        const sideWing = new Wing();
        this.mesh.add(sideWing.mesh);

        // propeller
        const propeller = new Propeller();
        this.mesh.add(propeller.mesh);
        this.propeller = propeller.mesh;

        this.mesh.add(pilot.mesh)
        pilot.mesh.position.y=30
        this.pilot = pilot;

        // blades
        const blade = new Blade();

        this.propeller.add(blade.mesh);
        this.propeller.position.set(50, 0, 0);

        this.mesh.add(this.propeller);
        this.mesh.scale.set(.25, .25, .25);
        this.mesh.position.y = 100;
    }
}

const airplane = new AirPlane();


export default airplane;