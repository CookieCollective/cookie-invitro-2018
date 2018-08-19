
attribute vec3 color;
attribute vec2 anchor, quantity;
uniform vec3 cameraPos, cameraTarget;
uniform float time;
varying vec2 vAnchor;
varying vec3 vColor;

void main () {
	float size = .02;
	// float salt = random(position.xz);
	float salt = noise(position*.15);
	float ratio = mod(salt * 10. + time * .2, 1.);
	size *= smoothstep(.0,.1,ratio) * smoothstep(1.,.9,ratio);
	ratio = smoothstep(.5,1.,ratio);
	float range = 2. * ratio * noise(position*4.);
	// vec3 pos = vec3(range,0,0);
	// pos.xz *= rotation(quantity.x * 150.4598);
	// pos.yz *= rotation(quantity.x * 20.1569748);
	// pos.yx *= rotation(quantity.x * 2.1569748);
	vec3 pos = position;
	vec3 offset = vec3(range,0,0);
	float seed = quantity.x;
	offset.xz *= rotation(seed * 10.4598 + time * .549);
	offset.yz *= rotation(seed * 20.1569748 + time * 1.54);
	offset.yx *= rotation(seed * 3.5465);
	pos += offset;
	vec3 front = normalize(cameraPos - pos);
	vec3 right = normalize(cross(front, vec3(0,1,0)));
	vec3 up = normalize(cross(front, right));

	pos += (right * anchor.x + up * anchor.y) * size;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	vAnchor = anchor;
	vColor = color;
}