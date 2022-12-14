import { Scene, Color } from 'three';
import { ObstacleManager, PebbleManager } from 'managers';
import { Floor, Left_Wall, Right_Wall } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor(floorWidth=5000, floorHeight=5000) {
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

        // Add pebbles to scene
        this.pebbleManager = new PebbleManager();
        this.add(...this.pebbleManager.pebbles);

        // Add floor and walls to scene
        const floor = new Floor(floorWidth, floorHeight);
        const left_wall = new Left_Wall();
        const right_wall = new Right_Wall();
        this.floor = floor;
        this.add(floor, left_wall, right_wall);
        this.floor = floor;

        // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        // const { updateList } = this.state;
        // // Call update for each object in the updateList
        // for (const obj of updateList) {
        //     obj.update(timeStamp);
        // }
    }
}

export default SeedScene;
