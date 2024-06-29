// src/shaders/localScreenSpaceUV.js
export const vertexShader = `
  varying vec4 vScreenPosition;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vScreenPosition = gl_Position;
  }
`

export const fragmentShader = `
  uniform vec2 resolution;
  uniform vec4 cubeCenter;
  uniform vec3 cubeBounds;
  
  varying vec4 vScreenPosition;

  void main() {
    // Convert clip space to screen space UV
    vec2 screenUV = (vScreenPosition.xy / vScreenPosition.w + 1.0) * 0.5;
    
    // Calculate the offset from the cube center
    vec2 offset = screenUV - cubeCenter.xy;
    
    // Scale the offset based on the cube's bounds
    vec2 scaledOffset = offset / (cubeBounds.xy / resolution);
    
    // Center and normalize the UV coordinates
    vec2 localUV = scaledOffset + 0.5;
    
    // Clip UVs outside the 0-1 range
    localUV = clamp(localUV, 0.0, 1.0);

    gl_FragColor = vec4(localUV, 0.0, 1.0);
  }
`
