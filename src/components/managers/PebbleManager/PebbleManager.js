import { Pebble } from 'objects';
import {
    MeshBasicMaterial,
    DodecahedronGeometry,
    IcosahedronGeometry,
    OctahedronGeometry, 
    TextureLoader,
} from 'three';
require('./pebble_files1/textures/PolySphere_baseColor.png')

class PebbleManager {
    constructor(numPebbles=10) {
        this.pebbles = []; 
        this.numPebbles = numPebbles;
        this.inactivePebbleSet = new Set(); // set to hold inactive pebbles

        // create shared texture
        const loader = new TextureLoader();
        const texture = loader.load('assets/src/components/managers/PebbleManager/pebble_files1/textures/PolySphere_baseColor.png');
        const pebbleMat = new MeshBasicMaterial({
            map: texture
        });   
        
        // create shared geometries
        const octoGeo = new OctahedronGeometry(1);
        const dodecGeo = new DodecahedronGeometry(0.5);
        const icosaGeo = new IcosahedronGeometry(0.75);
        const geos = [octoGeo, dodecGeo, icosaGeo];

        // Grid that defines the pebble grid being defined
        this.minX = -30; 
        this.maxX = 30; 
        this.minY = -2; 
        this.maxY = -2; 
        this.gridZDelta = 150; 
        this.minZ = 0; 
        this.maxZ = this.gridZDelta; 

        // make num pebbles
        const numPebblesOfEach = Math.floor(numPebbles);
        for (let i = 0; i < numPebblesOfEach; i++) {
            for (let j = 0; j < geos.length; j++) {
                const geo = geos[j];
                const newPebble = new Pebble(geo, pebbleMat);
                const x = this.generateIntBetween(this.minX, this.maxX);
                const y = this.minY; 
                const z = this.generateIntBetween(
                    this.minZ,
                    this.maxZ
                );           
                newPebble.position.x = x; 
                newPebble.position.y = y; 
                newPebble.position.z = z; 
                this.pebbles.push(newPebble);                         
            }
        }   
            }

    // update pebbles
    handlePebbles(frontierDepth) {
        // update entire grid of pebbles
        this.cleanUpPebbles(frontierDepth);
    }

    // helper function to generate random integer between min (inclusive) and max (inclusive)
    generateIntBetween(min, max) {
        const range = max - min + 1;
        return min + Math.floor(Math.random() * range);
    }
    
    // clean up obstacles behind given frontier depth
    cleanUpPebbles(frontierDepth) {
        // clean up active pebbles if they are behind frontier depth
        for (let i = 0; i < this.pebbles.length; i++) {
            const pebble = this.pebbles[i];
            // do not check if obstacle is inactive
            if (this.inactivePebbleSet.has(pebble)) {
                continue;
            } else {
                if (pebble.position.z < frontierDepth) {
                    // this.inactivePebbleSet.add(pebble);
                    const x = this.generateIntBetween(this.minX, this.maxX);
                    const y = this.minY; 
                    const z = frontierDepth + 200;   
                    pebble.position.x = x; 
                    pebble.position.y = y; 
                    pebble.position.z = z; 
                }
            }
        }
    }    
}

export default PebbleManager;