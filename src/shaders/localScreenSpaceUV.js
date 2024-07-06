// src/shaders/screenSpaceUV.js

export const vertexShader = `
  uniform vec3 uCamPos;
  uniform mat4 uInverseModelMat;

  varying vec2 vUv;
  varying vec4 vPosition;
  varying vec4 vRayOrigin;
  varying vec3 vHitPos;
  varying vec4 vClipPosition;

  void main() {
    vClipPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vClipPosition;
    vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 viewDirection = normalize(-worldPosition.xyz);
    vUv = uv;
    vPosition = worldPosition;
    vRayOrigin = uInverseModelMat * vec4(uCamPos, 1.0);
    // vHitPos = worldPosition.xyz;
    vHitPos = position;
  }
`

export const fragmentShader = `
  
  uniform vec2 uResolution;
  uniform vec3 uCubePosition;
  uniform vec3 uCubeViewPosition;
  uniform vec3 uCubeBounds;
  uniform vec3 uCubeScale;
  uniform sampler2D uvTexture;
  uniform float uDpr;
  
  varying vec4 vClipPosition;

  void main() {

    // Get screen space coordinates
    vec2 screenCoords = gl_FragCoord.xy;

    // Calculate aspect ratio
    float aspectRatio = uResolution.x / uResolution.y;

    // Convert screen space coordinates to UVs in the range [0, 1]
    vec2 screenUVs = screenCoords / (uResolution * uDpr);
    
    // Convert to [-1, 1] range
    vec2 mappedNdc = screenUVs * 2.0 - 1.0;
    
    // Calculate local screen space coordinates by substracting the cube's position
    vec2 localScreenSpace = (mappedNdc - uCubePosition.xy);

    // applying the aspect ration
    localScreenSpace.x *= aspectRatio;

    // center the UVs
    localScreenSpace += vec2(0.5);
   
    // scale UVs from center
    localScreenSpace = ((localScreenSpace - vec2(0.5)) *  -uCubeViewPosition.z / 5. / uCubeScale.x) + vec2(0.5);
    
    // Sample the texture with centered UVs
    gl_FragColor = texture2D(uvTexture, localScreenSpace);
  }
`
