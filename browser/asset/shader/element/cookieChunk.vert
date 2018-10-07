
attribute vec2 anchor, quantity;
attribute vec3 color, next;
uniform float time, timeLoop;
uniform vec2 resolution;
uniform vec3 cameraPos, cookie;
varying vec3 vColor, vNormal, vView;

void animate (inout vec3 p, float wave, float period) {
	// p.xz *= rot(timeLoop*.01);
	// p.yz *= rot(timeLoop*.1);
	float d = length(p.xz);
	float a = atan(p.z, p.x);
	// p.y += sin(d / 2. - timeLoop / 2.) * .1 * d;
	// p.xz *= rot(p.y + a * .1);
	float noisy = noise(p * 2. + quantity.x + period);
	p.xz *= rot(wave * quantity.x * 3.);
	p.yz *= rot(wave * quantity.x * 4.);
	p *= .5 + 2. * abs(sin(quantity.x));// + 5. * noisy;
	vec3 offset = vec3(1,0,0);
	offset.xz *= rot(-quantity.x * TAU+period * .1);
	offset.yz *= rot(-quantity.x * 2.5+period * .3);
	offset.yx *= rot(quantity.x * 30.+period * .2);
	p += normalize(offset) * wave * 50.;//(50. + 10. * noisy);
	p += cookie;

}

void main () {
	vec3 pos = position;
	vec3 nxt = next;
	// pos = mix(pos, next, anchor.y * .5 + .5);
	float speed = .5;
	float life = mod(timeLoop * speed, 1.);
	// life = smoothstep(0., 1., life);
	float period = floor(timeLoop * speed);
	float wave = mod(random(quantity.xx + period * .1), 1.);
	wave = mix(0., wave, life);
	// wave = wave * .5 + .5;
	// wave = smoothstep(.2, 1., wave);
	animate(pos, wave, period);
	animate(nxt, wave, period);
	// vec3 forward = normalize(next - pos);
	// vec3 right = normalize(cross(forward, normalize(pos)));
	// vec3 up = normalize(cross(right, forward));
	float size = 2. / resolution.y;// + .1 * sin(length(position) - timeLoop * 2.);
	size *= smoothstep(.0, .1, life) * smoothstep(1., .9, life);
	// pos += right * anchor.x * size;
	// animate(up);
	// vNormal = up;
	vView = cameraPos - pos;
	float y = anchor.y * .5 + .5;
	vec4 sPos = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
	vec4 sNxt = projectionMatrix * viewMatrix * modelMatrix * vec4(nxt, 1);
	vec2 forward = normalize(sNxt.xy-sPos.xy);
	vec2 right = vec2(forward.y, -forward.x);
	vColor = vec3(smoothstep(length(cameraPos-cookie), 10., length(pos-cameraPos)/2.));
	// vColor = vec3(1.-clamp(abs(sPos.x) * .01, 0., 1.));
	gl_Position = vec4(mix(sPos.xy/sPos.w, sNxt.xy/sNxt.w, y) + right * anchor.x * size, 1.-vColor.x, 1);
}