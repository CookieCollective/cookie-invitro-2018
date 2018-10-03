
uniform vec3 cameraPos, sun;
varying vec3 vNormal, vView;

void main () {
	vec3 pos = position;
	pos *= 50.;
	pos += sun;
	vView = cameraPos - pos;
	vNormal = normal;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}