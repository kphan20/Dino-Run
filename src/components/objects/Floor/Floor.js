import {
    PlaneGeometry,
    Group,
    MathUtils,
    Mesh,
    MirroredRepeatWrapping,
    TextureLoader,
    MeshBasicMaterial,
  } from 'three';
  
  // Basic structure and organization derived from starter code for Flower.js
  class Floor extends Group {
    constructor(parent) {
      super();

      // Disable automatic frustum culling (to use manual implementation)
      this.frustumCulled = false; 
  
      // Set object state
      this.state = {
        width: 10000,
        height: 10000
      };
  
      // create object mesh (Example followed https://threejs.org/docs/#api/en/geometries/PlaneGeometry)
      const objGeo = new PlaneGeometry(
        this.state.width,
        this.state.height
      );
  
      // Structure of fragment shader copied from https://dev.to/maniflames/creating-a-custom-shader-in-threejs-3bhi
      function fragmentShader() {
          return `
                varying vec3 worldCoord;
                varying float randomVal;

                void gridPattern() {
                    float cX = floor(worldCoord.x / 4.0); 
                    float cY = worldCoord.y; 
                    float cZ = floor(worldCoord.z / 4.0); 
                    float sum = floor(cX + cZ); 

                    if (mod(sum, 2.0) == 0.0) {
                        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                    } else {
                    }                    
                }

                void main() {
                    gridPattern();
                }
            `
      }

      function vertexShader() {
        return `
            varying vec3 worldCoord;
            varying float randomVal; 
            // Randomized function copied from link provided in Assignment Spec: https://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
            float rand(vec2 co){
                return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
            }

            void main() {  
                vec2 xz = vec2(position.x, position.z);
                randomVal = rand(xz);
                vec3 modPos = vec3(position.x, position.y, position.z);
                
                // Code copied and heavily adapted from https://discourse.threejs.org/t/how-to-get-vertex-coordinates-in-world-space/34282
                worldCoord = (modelMatrix * vec4(modPos, 1.0)).xyz;

                // Code copied and heavily adapted from https://dev.to/maniflames/creating-a-custom-shader-in-threejs-3bhi
                vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * modelViewPosition;               
            }
        `
      }
  
      const loader = new TextureLoader();
      const objMat = new MeshBasicMaterial({
        map: loader.load('resources/sand.jpeg', (texture) => {
            texture.wrapS =MirroredRepeatWrapping; 
            texture.wrapT = MirroredRepeatWrapping;
            texture.rotation = MathUtils.degToRad(57);
            // console.log(texture)
            texture.repeat.set(500, 500)

            const objMesh = new Mesh(objGeo, objMat);
  
            // rotate mesh to align horizontally
            objMesh.rotateX(Math.PI / -2);
        
            // set object position
            this.position.y = -2;
        
            // add mesh
            this.add(objMesh);            
        }),
      })
  
      const objMesh = new Mesh(objGeo, objMat);
      objMesh.frustumCulled = false;
    }
  }
  
  export default Floor;
