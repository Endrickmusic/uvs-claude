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
  uniform vec4 cubeCenter;
  uniform vec3 cubeBounds;
  uniform sampler2D uvTexture;

  varying vec4 vClipPosition;

  void main() {

      // Get screen space coordinates
    vec2 screenCoords = gl_FragCoord.xy;

    // Convert screen space coordinates to UVs in the range [0, 1]
    vec2 screenUVs = screenCoords / resolution;

    // Map the clip space coordinates to colors for visualization
    vec2 mappedNdc = screenUVs - .5;

    vec2 localScreenSpace = mappedNdc - cubeCenter.xy;
    // gl_FragColor = vec4(mappedNdc, 0.0, 1.0);
    // gl_FragColor = vec4(cubeCenter.xy, 0.0, 1.0);
    gl_FragColor = vec4(localScreenSpace, 0.0, 1.0);
    // gl_FragColor = vec4(screenUVs, 0.0, 1.0);
    gl_FragColor = texture2D(uvTexture, localScreenSpace);

  }
`

// ... (rest of the component code)

// // src/shaders/localScreenSpaceUV.js
// export const vertexShader = `
//   varying vec4 vScreenPosition;
//   varying vec2 vUv;

//   void main() {
//     vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
//     gl_Position = projectionMatrix * mvPosition;
//     vScreenPosition = gl_Position;
//     vUv = uv;
//   }
// `

// export const fragmentShader = `
//   uniform vec2 resolution;
//   uniform vec4 cubeCenter;
//   uniform vec3 cubeBounds;
//   uniform sampler2D uvTexture;

//   varying vec4 vScreenPosition;
//   varying vec2 vUv;

//   void main() {

//     vec2 uv = gl_FragCoord.xy / resolution;

//     // Convert clip space to screen space UV
//     vec2 screenUV = (vScreenPosition.xy / vScreenPosition.w + 1.0) * 0.5;

//     // Calculate the offset from the cube center
//     vec2 offset = screenUV - cubeCenter.xy;

//     // Scale the offset based on the cube's bounds
//     vec2 cubeScreenSize = cubeBounds.xy / resolution;
//     vec2 localUV = offset / cubeScreenSize + 0.5;

//     // Sample the texture using the calculated UV coordinates
//     // gl_FragColor = texture2D(uvTexture, localUV);
//     // gl_FragColor = texture2D(uvTexture, vUv);
//     gl_FragColor = vec4(screenUV, 0.0, 1.0);
//   }
// `
