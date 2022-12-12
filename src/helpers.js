import {
    Vector3,
    BoxBufferGeometry,
    Matrix4,
    WireframeGeometry,
    LineSegments,
} from 'three';

export const drawWireFrameBox = (object) => {
    const dimensions = new Vector3().subVectors(
        object.originalBoundingBox.max,
        object.originalBoundingBox.min
    );
    const boxGeo = new BoxBufferGeometry(
        dimensions.x,
        dimensions.y,
        dimensions.z
    );
    const matrix = new Matrix4().setPosition(
        dimensions
            .addVectors(
                object.originalBoundingBox.min,
                object.originalBoundingBox.max
            )
            .multiplyScalar(0.5)
    );
    boxGeo.applyMatrix4(matrix);
    object.wireframe = new WireframeGeometry(boxGeo);
    const line = new LineSegments(object.wireframe);
    line.material.depthTest = false;
    line.material.opacity = 0.25;
    line.material.transparent = true;
    object.add(line);
};
