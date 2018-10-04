
attribute vec3 color;
attribute vec2 anchor, quantity;
uniform vec3 cameraPos, cameraTarget;
uniform float time;
varying vec2 vAnchor;
varying vec3 vColor;

void main () {
	float salt = random(quantity.xx*10.);
	float pepper = random(quantity.xx*10.+vec2(.546857,.951354));
	float size = .3+.2*salt;
	vec3 pos = position * 30.;
	pos = normalize(pos) * 200.;
	// pos.z *= 2.;
	// pos.x -= 50.;
	// pos.y += 15.;
	// pos.xz *= rotation(time*(.1+salt)*.01);
	// pos.yz *= rotation(time*(.1+pepper)*.01);

	vec3 front = normalize(cameraPos - pos);
	vec3 right = normalize(cross(front, vec3(0,1,0)));
	vec3 up = normalize(cross(front, right));
	pos += (right * anchor.x + up * anchor.y) * size;

	vAnchor = anchor;
	vColor = vec3(1);
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}