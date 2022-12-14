
export function boxesIntersect(box1, box2) {
    const min1 = box1.min; 
    const max1 = box1.max; 
    const min2 = box2.min; 
    const max2 = box2.max; 

    const xIntersects = intersectHelper(min1.x, max1.x, min2.x, max2.x);
    const yIntersects = intersectHelper(min1.y, max1.y, min2.y, max2.y);
    const zIntersects = intersectHelper(min1.z, max1.z, min2.z, max2.z);

    return xIntersects && yIntersects && zIntersects; 
}

function intersectHelper(min1, max1, min2, max2) {
    if (min1 < min2) return max1 > min2; 
    else {
        return max2 > min1; 
    }
}
