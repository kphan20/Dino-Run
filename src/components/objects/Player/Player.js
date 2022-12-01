import { Group, Mesh, CylinderGeometry, MeshPhongMaterial } from 'three';

class Player extends Group {
    constructor(parent, camera) {
        // Call parent Group() constructor
        super();

        const test = new Mesh(new CylinderGeometry(), new MeshPhongMaterial());
        test.add(camera);
        this.add(test);
        // Init state
        this.state = {
            gui: parent.state.gui,
        };

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {}
}

export default Player;
