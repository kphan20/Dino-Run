import { Mesh, Box3 } from 'three';

class Player extends Mesh {
    constructor(camera, playerBody) {
        // Call parent Group() constructor
        super();
        this.add(camera);
        this.visible = false;

        // Disable automatic frustum culling
        this.frustumCulled = false;

        this.originalBoundingBox = new Box3();
        this.boundingBox = this.originalBoundingBox.clone();

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
        this.boundingBox = this.originalBoundingBox.clone();
        this.boundingBox.translate(this.position);
        this.playerBody.position.set(
            this.position.x,
            this.position.y,
            this.position.z
        );
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
