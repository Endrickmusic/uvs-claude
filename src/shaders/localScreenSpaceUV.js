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
  uniform float uTime;
  uniform float uSize;
  uniform vec3 uForward;
  uniform float uNearPlaneWidth;
  uniform float uNearPlaneHeight;

  varying vec4 vClipPosition;
  varying vec2 vUv;
  varying vec4 vPosition;
  varying vec4 vRayOrigin;
  varying vec3 vHitPos;
    
  const float PI = 3.1415926;
  const float HALF_PI = 0.5 * PI;
  const float TWO_PI = 2.0 * PI;
  const int LOOP = 16;

  #define MAX_STEPS 100
  #define MAX_DIST 100.
  #define SURF_DIST 1e-3
  #define samples 32
  #define LOD 

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

  // sphere
	float d = length(p) - .5; 
	d = length(vec2(length(p.xz) - .4, p.y)) - .1;
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
    localScreenSpace = ((localScreenSpace - vec2(0.5)) * -uCubeViewPosition.z / uCubeScale.x) + vec2(0.5);
    // localScreenSpace = localScreenSpace * -uCubeViewPosition.z;
    
    vec2 uv = localScreenSpace;

		// Compute the right, up, and forward vectors for the camera
		vec3 forward = normalize(uForward);
		vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
		vec3 up = cross(forward, right);

		// Compute the ray origin based on the orthographic projection
		vec3 ro = vRayOrigin.xyz + uv.x * right + uv.y * up;

		// The ray direction is constant and points towards the target
		vec3 rd = forward;
		float d = Raymarch(ro, rd);

		vec3 col = vec3(0.0);

		// if ( d >= MAX_DIST )
		// 	discard;
    //   // col = vec3(0.3);
		// else {
		// 	vec3 p = ro + rd * d;
		// 	vec3 n = GetNormal(p);
		// 	col.rgb = n;
		// }
    //     gl_FragColor = vec4(col, 1.0);

		// gl_FragColor = vec4(uv, 0.0, 1.0);

    // Sample the texture with centered UVs
    gl_FragColor = texture2D(uvTexture, localScreenSpace);
  }
`
