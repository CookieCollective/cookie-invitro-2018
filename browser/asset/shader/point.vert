
attribute vec2 anchor, quantity;

uniform float time;

varying vec2 vAnchor;

void main () {
	float size = .1;
	vec3 pos = position;

	vec3 front = normalize(cameraPosition - pos);
	vec3 right = normalize(cross(front, vec3(0,1,0)));
	vec3 up = normalize(cross(front, right));

	pos += (right * anchor.x + up * anchor.y) * size;

	gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1);
	
	vAnchor = anchor;
}