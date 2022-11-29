import { Bird, Cactus } from 'objects';

class ObstacleManager {
    constructor(obstacleParent) {
        this.obstacles = []; // array to hold obstacles
        this.inactiveObstacleSet = new Set(); // set to hold inactive obstacles

        // generate 2 obstacles for now
        this.obstacles.push(new Cactus(obstacleParent));
        this.obstacles.push(new Bird(obstacleParent));
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
