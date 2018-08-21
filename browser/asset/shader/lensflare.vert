
attribute vec2 anchor, quantity;
uniform vec2 resolution;
uniform vec3 cameraPos, cameraTarget;
varying vec2 vAnchor;
varying vec3 vCameraDir;

void main () {
	float size = .01+.2*random(vec2(quantity.x)*15.546);
	float range = .5;
	float angle = TAU * random(vec2(quantity.x));
	float radius = .5 + range * random(vec2(quantity.x)+vec2(10.21,42.124));
	vec2 pos = vec2(cos(angle), sin(angle)) * radius;
	pos += anchor * size * vec2(resolution.y/resolution.x, 1.);
	vAnchor = anchor;
	vCameraDir = cameraTarget - cameraPos;
	gl_Position = vec4(pos, 0, 1);
}