import { Vector3 } from 'three';
import { Bird, Cactus } from 'objects';

class ObstacleManager {
    constructor(obstacleParent) {
        this.obstacles = []; // array to hold obstacles
        this.inactiveObstacleSet = new Set(); // set to hold inactive obstacles

        // generate 2 obstacles for now
        this.obstacles.push(new Cactus(obstacleParent));
        this.obstacles.push(new Bird(obstacleParent));

        // add all obstacles initially to inactive obstacle set 
        for (let i = 0; i < this.obstacles.length; i++) {
            this.inactiveObstacleSet.add(this.obstacles[i]);
        }

        // bounds used for obstacle generation
        this.minX = -3; // minimum bound for x coordinate
        this.maxX = 3; // maximum bound for x coordinate
        this.minY = 0; // minimum bound for y coordinate
        this.maxY = 0; // maximum bound for y coordinate
        this.maxZDist = 5; // maximum distance from inputted frontier depth 
    }

    // place an obstacle at a random position in front of frontier depth 
    generateObstacle(frontierDepth) {
        // generate random coordinates
        const x = this.generateIntBetween(this.minX, this.maxX);
        const y = this.generateIntBetween(this.minY, this.maxY);
        const z = this.generateIntBetween(frontierDepth, frontierDepth + this.maxZDist);
        const pos = new Vector3(x, y, z);
        const inactiveObstacle = [...this.inactiveObstacleSet.keys()][0];
        inactiveObstacle.placeBottomAt(pos);
        this.inactiveObstacleSet.delete(inactiveObstacle);
    }

    // helper function to generate random integer between min (inclusive) and max (inclusive)
    generateIntBetween(min, max) {
        const range = max - min + 1; 
        return min + Math.floor(Math.random() * range);
    }

    // clean up obstacles behind given frontier depth
    cleanUpObstacles(frontierDepth) {
        // clean up active obstacles if they are behind frontier depth
        for (let i = 0; i < this.obstacles.length; i++) {
            const obstacle = this.obstacles[i]; 
            // do not check if obstacle is inactive
            if (this.inactiveObstacleSet.has(obstacle)) {
                continue;
            }
            else {
                if (obstacle.position.z < frontierDepth) {
                    obstacle.garbageCollect();
                    this.inactiveObstacleSet.add(obstacle);
                }
            }
        }
    }
}

export default ObstacleManager; 
