
attribute vec2 anchor, quantity;
uniform vec3 cameraPos, cameraTarget, panel;
uniform vec2 resolution;
uniform float time;
varying vec2 vAnchor;
varying vec3 vNormal, vView;

// chunk(shadowmap_pars_vertex);

void displace (inout vec3 pos, float ratio) {
	pos = mix(vec3(0), panel*.9999, ratio);
}

void main () {
	float size = .02;
	vec3 pos = position;
	vec3 next = pos;
	// float y = mix(anchor.y)
	float ratio = anchor.y*.5+.5;
	displace(pos, ratio);
	displace(next, ratio + .01);

	// vec3 front = normalize(cameraPos - pos);
	// vec3 right = normalize(cross(front, vec3(0,1,0)));
	// vec3 up = normalize(cross(front, right));
	vec3 front = normalize(next - pos);
	vec3 right = normalize(cross(front, vec3(0,1,0)));
	vec3 up = normalize(cross(front, right));
	up = (rotationMatrix(front, -(anchor.x * .5 + .5) * PI) * vec4(up,1)).xyz;
	pos += (up * anchor.x) * size;
	// pos.x += 1. + sin(anchor.y * 10.);
	float salt = random(quantity.xx) * .5 + .5;
	float mess = sin(anchor.y * 30.) * sin(anchor.y * 100. + salt * 10. + anchor.y * 25. + quantity.y * 1.546) * .1 * salt;
	float fade = .01 + .99 * (1.-abs(anchor.y));
	pos.x -= quantity.x * 1. * fade + mess + fade * .5 * sin(anchor.y * 20.);

	vNormal = up;
	vView = cameraPos - pos;
	vAnchor = anchor;
  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  // chunk(shadowmap_vertex);
	gl_Position = projectionMatrix * viewMatrix * worldPosition;
}