
uniform float time;
uniform vec3 cameraPos;
varying vec3 vView;
varying vec2 vScreen;

void main () {
	vec3 pos = position;
	vec3 seed = pos;
	// seed.xz *= rotation(time*.009);
	// seed.xy *= rotation(time*.006);
	// seed.yz *= rotation(time*.003);
	float noisy1 = noise(seed*.3)*2.-1.;
	float noisy2 = noise(seed*.2+vec3(1.321,9.2,5.239))*2.-1.;
	pos.xy *= rotation(noisy2*.05);
	pos.xz *= rotation(noisy1*.05);
	pos.yz *= rotation(noisy2*.05);
	float lod = 2.;
	pos = floor(pos * lod) / lod;
	vView = cameraPos - pos;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	vScreen = gl_Position.xy;
}