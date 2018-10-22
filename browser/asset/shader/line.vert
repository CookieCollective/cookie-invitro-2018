attribute vec2 anchor, quantity;
attribute vec3 color, next;

uniform float time;
uniform vec2 resolution;

varying vec2 vAnchor;

void main () {
	vec3 pos = position;
	vec3 nxt = next;

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