import {
    Mesh,
    CylinderGeometry,
    MeshPhongMaterial,
    Vector3,
    BoxBufferGeometry,
    Matrix4,
    WireframeGeometry,
    LineSegments,
} from 'three';

class Player extends Mesh {
    constructor(parent, camera, playerBody) {
        // Call parent Group() constructor
        super(new CylinderGeometry(), new MeshPhongMaterial());
        this.add(camera);
        this.geometry.computeBoundingBox();

        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.originalBoundingBox = this.geometry.boundingBox;
        const dimensions = new Vector3().subVectors(
            this.originalBoundingBox.max,
            this.originalBoundingBox.min
        );
        const boxGeo = new BoxBufferGeometry(
            dimensions.x,
            dimensions.y,
            dimensions.z
        );
        const matrix = new Matrix4().setPosition(
            dimensions
                .addVectors(
                    this.originalBoundingBox.min,
                    this.originalBoundingBox.max
                )
                .multiplyScalar(0.5)
        );
        boxGeo.applyMatrix4(matrix);
        this.wireframe = new WireframeGeometry(boxGeo);
        const line = new LineSegments(this.wireframe);
        line.material.depthTest = false;
        line.material.opacity = 0.25;
        line.material.transparent = true;
        this.add(line);

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
        this.geometry.computeBoundingBox();
        this.geometry.boundingBox.translate(this.position);
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

    update(timeStamp) {}
}

export default Player;
