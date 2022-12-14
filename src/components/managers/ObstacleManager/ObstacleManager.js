import { Vector3 } from 'three';
import { Bird, Cactus } from 'objects';

class ObstacleManager {
    constructor() {
        this.obstacles = []; // array to hold obstacles
        this.inactiveObstacleSet = new Set(); // set to hold inactive obstacles

        // generate 2 obstacles for now
        this.obstacles.push(new Cactus());
        this.obstacles.push(new Cactus());
        this.obstacles.push(new Cactus());
        this.obstacles.push(new Cactus());
        this.obstacles.push(new Cactus(true));
        this.obstacles.push(new Cactus(false, true));
        this.obstacles.push(new Bird());
        this.obstacles.push(new Bird());
        this.obstacles.push(new Bird());
        this.obstacles.push(new Bird());

        // add all obstacles initially to inactive obstacle set
        for (let i = 0; i < this.obstacles.length; i++) {
            this.inactiveObstacleSet.add(this.obstacles[i]);
        }

        // bounds used for obstacle generation
        this.minZDist = 30; // minimum distance from inputted frontier depth
        this.maxZDist = 50; // maximum distance from inputted frontier depth

        // chance of obstacle being generated when available per render cycle
        this.generationProbability = 0.2;
    }

    // render handler for obstacles
    handleObstacles(frontierDepth) {
        this.cleanUpObstacles(frontierDepth);
        this.generateObstacle(frontierDepth);
    }

    // place an obstacle at a random position in front of frontier depth
    generateObstacle(frontierDepth) {
        // return if no obstacles exist at the moment
        if (this.inactiveObstacleSet.size === 0) {
            return;
        }

        // chance of obstacle
        if (Math.random() > this.generationProbability) {
            return;
        }

        // generate random coordinates
        const inactiveObstacle = [...this.inactiveObstacleSet.keys()][0];
        const x = this.generateIntBetween(
            inactiveObstacle.minX,
            inactiveObstacle.maxX
        );
        const y = this.generateIntBetween(
            inactiveObstacle.minY,
            inactiveObstacle.maxY
        );
        const z = this.generateIntBetween(
            frontierDepth + this.minZDist,
            frontierDepth + this.maxZDist
        );
        const pos = new Vector3(x, y, z);
        inactiveObstacle.placeBottomAt(pos);
        this.inactiveObstacleSet.delete(inactiveObstacle);
        inactiveObstacle.updateBoundingBox();
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
            } else {
                if (obstacle.position.z < frontierDepth) {
                    obstacle.garbageCollect();
                    this.inactiveObstacleSet.add(obstacle);
                }
            }
        }
    }

    resetObstacles() {
        this.obstacles.forEach((obstacle) => {
            obstacle.garbageCollect();
            obstacle.position.z = -10;
            this.inactiveObstacleSet.add(obstacle);
        });
    }
}

export default ObstacleManager;
