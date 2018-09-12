
attribute vec3 color;
uniform float time;
uniform vec3 cameraPos;
varying vec3 vColor;

void main () {
	vec3 pos = position;
	float t = time * .01;
	pos *= 10.;
	// pos.xyz = pos.yxz;
	pos.zx *= rotation(t);
	// pos.xy *= rotation(-PI/8.+PI);
	// pos.yz *= rotation(t*.5);
	pos.y += 10.;
	// pos.x -= 20.;
	vColor = color;// * clamp(pos.y*.1+.2, 0., 1.);
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}