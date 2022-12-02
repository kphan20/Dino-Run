import {
    PerspectiveCamera,
    TextGeometry,
    FontLoader,
    MeshBasicMaterial,
    Mesh,
} from 'three';

class HudCamera extends PerspectiveCamera {
    constructor() {
        super();
        const ref = this;
        const loader = new FontLoader();
        loader.load('fonts/helvetiker_regular.typeface.json', (font) => {
            const score = new TextGeometry('example', {
                font: font,
                size: 50,
                height: 10,
            });
            const mesh = new Mesh(
                score,
                new MeshBasicMaterial({ color: 0x000000 })
            );
            ref.add(mesh);
        });
        this.score = new TextGeometry('0');
    }
}
