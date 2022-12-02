import { Mesh, CylinderGeometry, MeshPhongMaterial } from 'three';

class Player extends Mesh {
    constructor(parent, camera) {
        // Call parent Group() constructor
        super(new CylinderGeometry(), new MeshPhongMaterial());
        this.add(camera);
        this.geometry.computeBoundingBox();

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    movePlayer(dx, dy, dz) {
        this.position.x += dx;
        this.position.y += dy;
        this.position.z += dz;
        this.geometry.boundingBox.min.add(this.position);
        this.geometry.boundingBox.max.add(this.position);
    }

    update(timeStamp) {}
}

export default Player;
