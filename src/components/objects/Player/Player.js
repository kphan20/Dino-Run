import { Mesh, CylinderGeometry, MeshPhongMaterial } from 'three';

class Player extends Mesh {
    constructor(parent, camera, playerBody) {
        // Call parent Group() constructor
        super(new CylinderGeometry(), new MeshPhongMaterial());
        this.add(camera);
        this.geometry.computeBoundingBox();

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // How much to rotate by for each key press
        this.rotationDelta = Math.PI / 16; 

        // Save player body
        this.playerBody = playerBody; 
    }

    rotatePlayerLeft() {
        this.rotation.y += this.rotationDelta; 
    }

    rotatePlayerRight() {
        this.rotation.y -= this.rotationDelta; 
    }

    movePlayer(dx, dy, dz) {
        this.translateX(dx);
        this.translateY(dy);
        this.translateZ(dz);
        this.geometry.boundingBox.min.add(this.position);
        this.geometry.boundingBox.max.add(this.position);
        this.playerBody.position.set(this.position.x, this.position.y, this.position.z);
    }

    jumpPlayer() {
        const EPS = 0.01;
        const height = this.playerBody.shapes[0].height;
        const exp_floor = this.playerBody.position.y - height / 2;
        const onGround = Math.abs(exp_floor) < EPS;
        if (onGround) this.playerBody.velocity.set(0, 10, 0);
        this.position.copy(this.playerBody.position);
        return onGround;
    }

    update(timeStamp) { }
}

export default Player;
