
uniform vec3 satelitte;
varying vec2 vUv;
varying vec3 vNormal, vView;

void main () {
	vec3 pos = position;
	pos += satelitte;
	vUv = uv;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}