attribute vec2 anchor, quantity;
attribute vec3 color, next;

uniform float time;
uniform vec2 resolution;

varying vec2 vAnchor;

void animate (float ratio, out vec3 p, vec3 n) {
	float fade = smoothstep(1.2, .5, length(p));
	float t = sin(time + quantity.x * 11354.6546) * .1;
	// vec3 offset = vec3(
	// 	sin(quantity.x * TAU * 100.) * .5 * fade,
	// 	sin(quantity.x * TAU * 10.) * .5 * fade,
	// 	abs(sin(quantity.x * TAU * 1000.)) * 2. * fade);
	vec3 offset = normalize(vec3(p.x, p.y, 0.));
	offset.z += abs(sin(quantity.x * TAU * 1000.)) * 2.;
	p += offset * ratio * fade;
}

void main () {
	vec3 pos = position;
	vec3 nxt = next;

	float ratio = mod(time * (.2 + .1 * sin(quantity.x * 65.1635)) + quantity.x, 1.);

	animate(ratio, pos, nxt);
	animate(ratio, nxt, pos);

	vec2 size = 10. / resolution;

	size *= smoothstep(.0, .1, ratio) * smoothstep(1., .9, ratio);

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