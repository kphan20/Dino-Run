import { Pebble } from 'objects';

class PebbleManager {
    constructor(numPebbles=10) {
        this.pebbles = []; 
        this.numPebbles = numPebbles;
        this.inactivePebbleSet = new Set(); // set to hold inactive pebbles

        const pebble = new Pebble(); 
        
        // Grid that defines the pebble grid being defined
        this.minX = -30; 
        this.maxX = 30; 
        this.minY = 0; 
        this.maxY = 0; 
        this.gridZDelta = 300; 
        this.minZ = 0; 
        this.maxZ = this.gridZDelta; 

        this.generationProbability = 0.01; 

        for (let i = 0; i < this.numPebbles; i++) {
            const newPebble = pebble.clone(); 
            const x = this.generateIntBetween(this.minX, this.maxX);
            const y = 0; 
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

    // update pebbles
    handlePebbles(frontierDepth) {
        // player should be halfway through the grid
        const halfWayThroughGrid = this.minZ + (this.maxZ - this.minZ) / 2; 
        if (frontierDepth < halfWayThroughGrid) return; 

        // update entire grid of pebbles
        this.cleanUpPebbles(frontierDepth);

        this.minZ = this.maxZ; 
        this.maxZ = this.minZ + this.gridZDelta; 

        const inactivePebbles = [...this.inactivePebbleSet.keys()];
        for (let i = 0; i < inactivePebbles.length; i++) {
            const pebble = inactivePebbles[i];
            const x = this.generateIntBetween(this.minX, this.maxX);
            const y = 0; 
            const z = this.generateIntBetween(
                this.minZ,
                this.maxZ
            );            
            pebble.position.x = x; 
            pebble.position.y = y; 
            pebble.position.z = z; 
        }

        this.inactivePebbleSet.clear();
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
                    this.inactivePebbleSet.add(pebble);
                }
            }
        }
    }    
}

export default PebbleManager;