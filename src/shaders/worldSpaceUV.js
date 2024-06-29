// src/shaders/worldSpaceUV.js
export const vertexShader = `
  varying vec3 vPosition;

  void main() {
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const fragmentShader = `
  uniform float scale;
  varying vec3 vPosition;

  void main() {
    vec2 uv = vPosition.xy * scale;
    gl_FragColor = vec4(fract(uv), 0.0, 1.0);
  }
`
