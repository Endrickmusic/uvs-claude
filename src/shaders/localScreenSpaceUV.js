// src/shaders/screenSpaceUV.js

export const vertexShader = `
  varying vec4 vClipPosition;

  void main() {
    vClipPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vClipPosition;
  }
`

export const fragmentShader = `
  
  uniform vec2 resolution;
  uniform vec3 cubePosition;
  uniform vec3 cubeViewPosition;
  uniform vec3 cubeBounds;
  uniform sampler2D uvTexture;

  varying vec4 vClipPosition;

  void main() {

    // Get screen space coordinates
    vec2 screenCoords = gl_FragCoord.xy;

    // Calculate aspect ratio
    float aspectRatio = resolution.x / resolution.y;

    // Convert screen space coordinates to UVs in the range [0, 1]
    vec2 screenUVs = screenCoords / resolution;
    
    // Convert to [-1, 1] range
    vec2 mappedNdc = screenUVs * 2.0 - 1.0;
    
    // Calculate local screen space coordinates by substracting the cube's position
    vec2 localScreenSpace = (mappedNdc - cubePosition.xy);

    // applying the aspect ration
    localScreenSpace.x *= aspectRatio;

    // center the UVs
    localScreenSpace += vec2(0.5);
   
    // scale UVs from center
    localScreenSpace = ((localScreenSpace - vec2(0.5)) *  -cubeViewPosition.z / 5.) + vec2(0.5);
    
    // Sample the texture with centered UVs
    gl_FragColor = texture2D(uvTexture, localScreenSpace);
  }
`
