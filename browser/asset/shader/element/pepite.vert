
uniform float time, timeLoop;
uniform vec3 pepite, cameraPos, timeElapsed;

varying vec2 vUv;
varying vec3 vNormal, vView, vColor;

void main () {
	vec3 pos = position * 20.;
	pos += pepite;
	float anim = .5;//mod(timeLoop, 1.);
	// pos += mix(cameraPos, pepite, anim);
	// pos.xz += (1.-anim) * 5. + sin(anim*PI) * 10.;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}