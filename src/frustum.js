import { Vector3, Vector4 } from 'three';

// Frustum culling
export const handleFrustumCulling = (scene, camera) => {
    scene.traverse((obj) => {
        obj.frustumCulled = inFrustum(obj, camera);
    });
};
const inFrustum = (obj, camera) => {
    const projectionMatrix = camera.projectionMatrix;
    const matrix = projectionMatrix;
    let boundingBox = null;
    if (obj === undefined) return true;
    else if (obj.name === 'bird' || obj.name === 'cacti') {
        obj.updateBoundingBox();
        boundingBox = obj.boundingBox;
    } else if (obj.geometry != undefined) {
        boundingBox = obj.geometry.boundingBox;
    }
    if (boundingBox === null) return true;

    // 8 vertices
    const min = boundingBox.min;
    const max = boundingBox.max;

    const v1 = new Vector3(min.x, min.y, min.z);
    const v2 = new Vector3(min.x, min.y, max.z);
    const v3 = new Vector3(min.x, max.y, min.z);
    const v4 = new Vector3(min.x, max.y, max.z);
    const v5 = new Vector3(max.x, min.y, min.z);
    const v6 = new Vector3(max.x, min.y, max.z);
    const v7 = new Vector3(max.x, max.y, min.z);
    const v8 = new Vector3(max.x, max.y, max.z);
    const verts = [v1, v2, v3, v4, v5, v6, v7, v8];

    for (let i = 0; i < verts.length; i++) {
        const v = verts[i];
        const worldV = obj.localToWorld(v);
        const worldV4 = new Vector4(worldV.x, worldV.y, worldV.z, 1);
        const cameraV4 = worldV4.applyMatrix4(camera.matrixWorldInverse);

        const projV4 = cameraV4.applyMatrix4(matrix);
        const x = projV4.x;
        const y = projV4.y;
        const z = projV4.z;
        const w = projV4.w;

        if (x >= -w && x <= w && y >= -w && y <= w && z >= 0 && z <= w)
            return true;
    }

    return false;
};
