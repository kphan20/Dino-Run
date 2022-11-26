import { Bird, Cactus } from 'objects';

class ObstacleManager {
    constructor(obstacleParent) {
        this.obstacles = []; // array to hold obstacles

        // generate 2 obstacles for now
        this.obstacles.push(new Cactus(obstacleParent));
        this.obstacles.push(new Bird(obstacleParent));
    }
}

export default ObstacleManager; 
