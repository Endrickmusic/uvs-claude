// src/shaders/screenSpaceUV.js
export const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const fragmentShader = `
  uniform vec2 resolution;
  varying vec2 vUv;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    gl_FragColor = vec4(uv, 0.0, 1.0);
  }
`
