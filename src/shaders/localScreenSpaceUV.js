// src/shaders/screenSpaceUV.js

export const vertexShader = `
  uniform vec3 uCamPos;
  uniform mat4 uInverseModelMat;
  
  varying vec4 vClipPosition;
  varying vec4 vRayOrigin;
  varying vec3 vHitPos;

  void main() {
    vClipPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vClipPosition;
  }
`

export const fragmentShader = `
  
  uniform vec2 uResolution;
  uniform vec3 uCubePosition;
  uniform vec3 uCubeViewPosition;
  uniform vec3 uCubeScale;
  uniform sampler2D uvTexture;
  uniform vec3 uForward;

  varying vec4 vRayOrigin;
  varying vec3 vHitPos;

  const float PI = 3.1415926;
  const float HALF_PI = 0.5 * PI;
  const float TWO_PI = 2.0 * PI;
  const int LOOP = 16;

  #define MAX_STEPS 40
  #define MAX_DIST 40.
  #define SURF_DIST 1e-3
  #define samples 32
  #define LOD 
  varying vec4 vClipPosition;

  float hash(in float v) { return fract(sin(v)*43237.5324); }
  vec3 hash3(in float v) { return vec3(hash(v), hash(v*99.), hash(v*9999.)); }

  float sphere(in vec3 p, in float r) { 
    float d = length(p) - r; 
      return d;
  }

  float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
  }

#define BALL_NUM 5

  float GetDist(vec3 p) {

	float d = length(p) - .3; // sphere
	  d = length(vec2(length(p.xz) - .15, p.y)) - .02;
	  return d;
  }

  float Raymarch(vec3 ro, vec3 rd) {
	float dO = 0.;
	float dS;
	for (int i = 0; i < MAX_STEPS; i++) {
		vec3 p = ro + rd * dO;
		dS = GetDist(p);
		dO += dS;
		if (dS < SURF_DIST || dO > MAX_DIST) break;
	}
	return dO;
}

  vec3 GetNormal(in vec3 p) {
	  vec2 e = vec2(1., -1.) * 1e-3;
      return normalize(
        e.xyy * GetDist(p+e.xyy)+
        e.yxy * GetDist(p+e.yxy)+
        e.yyx * GetDist(p+e.yyx)+
        e.xxx * GetDist(p+e.xxx)
      );
}

  void main() {

    // Get screen space coordinates
    vec2 screenCoords = gl_FragCoord.xy;

    // Calculate aspect ratio
    float aspectRatio = uResolution.x / uResolution.y;

    // Convert screen space coordinates to UVs in the range [0, 1]
    vec2 screenUVs = screenCoords / (uResolution);
    
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
    
    vec2 uv = localScreenSpace;

    vec3 forward = normalize(uForward);
		vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
		vec3 up = cross(forward, right);

		// // Compute the ray origin based on the orthographic projection
		vec3 ro = vRayOrigin.xyz + uv.x * right + uv.y * up;
		// vec3 ro = vec3(uv.x * 4.0, uv.y * 4.0, 1.0);
		// // The ray direction is constant and points towards the target
		vec3 rd = normalize(uForward);

    // Sample the texture with centered UVs
    gl_FragColor = texture2D(uvTexture, localScreenSpace);
  }
`
