attribute vec2 anchor, quantity;

uniform float time;
uniform vec2 resolution;

varying vec2 vAnchor;

void animate (inout vec3 p) {
	float i = floor(quantity.y / 2.);
	p.xz *= rotation(time + i * .15465);
	p.yz *= rotation(time + i * .98735);
}

void main () {
	float i = floor(quantity.y / 2.);
	vec3 pos = vec3(1.5+.25*sin(i*100.),0,0);
	float n = mix(-1., 1., mod(quantity.y, 2.));
	float b = mix(-1., 1., mod(i, 2.));
	pos.xz *= rotation(i * .1546);
	pos.yz *= rotation(i * .687354);
	pos.yx *= rotation(i * .8973);
	pos.z = abs(pos.z);

	float l = .02 + .01*sin(i*.984);

	vec3 front = normalize(pos);
	vec3 up = vec3(0,1,0);
	animate(front);
	animate(up);

	vec3 nxt = pos + (front * n + up * b) * l;
	pos -= (front * n + up * b) * l;


	vec2 size = 10. / resolution;

	gl_Position = vec4(0, 0, 0, 1);
	
	vec4 sPos = projectionMatrix * viewMatrix * vec4(pos, 1);
	vec4 sNxt = projectionMatrix * viewMatrix * vec4(nxt, 1);
	gl_Position.xy = mix(sPos.xy/sPos.w, sNxt.xy/sNxt.w, anchor.y*.5+.5);
	
	vec2 forward = normalize(sNxt.xy-sPos.xy);
	vec2 right = vec2(forward.y, -forward.x);
	gl_Position.xy += right * anchor.x * size;
	// gl_Position.xy += forward * sign(anchor.y) * size / 2.;

	vAnchor = anchor;
}
