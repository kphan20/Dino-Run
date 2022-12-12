import { Scene, Color } from 'three';
import { ObstacleManager } from 'managers';
import { Floor } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const lights = new BasicLights();
        this.add(lights);

        // Add obstacles to scene
        this.obstacleManager = new ObstacleManager(this);
        this.add(...this.obstacleManager.obstacles);

        // Add floor and walls to scene
        const floor = new Floor();
        this.add(floor);
    }
}

export default SeedScene;
