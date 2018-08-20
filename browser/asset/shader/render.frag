
uniform sampler2D frame, curve, text;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

float sdbox (vec2 p, vec2 r) { vec2 d = abs(p)-r; return max(d.x, d.y); }

void main () {
	vec2 uv = vUv;
	vec4 color = texture2D(frame, uv);
	vec3 background = mix(vec3(1,0,0),vec3(0),uv.y);
	// uv.x = (uv.x-.5)*resolution.x/resolution.y+.5;
	// vec4 overlay = texture2D(text, uv);
	vec4 overlay = vec4(0);
	vec2 p = uv * 2. - 1.;
	// float lod = 8.;
	// float salt = random(floor(uv.xx*lod)/lod);
	// float x = mod(uv.x * 10. + salt, 1.);
	// float shade = step(x, .5);
	// color = mix(color, 1.-color, shade);
	// const float count = 10.;
	// p *= rotation(PI/4.);
	// float wave = sin(time+sin(time*10.));
	// for (float i = count; i > 0.; --i) {
	// 	float r = i/count;
		// p *= rotation(wave*.2);
		// p.x += r*.2;
		// box = min(box, abs(sdbox(p, .3+.1*r*wave)));
	// }
	// pModPolar(p, 4.);
	// p.x = repeat(p.x - time * .1, .1);
	// float tracer = sin(p.x);
	// color.rgb = mix(background, color.rgb, color.a);
	float tracer = sdbox(p, vec2(.9, .7));
	tracer = smoothstep(.001, 1., .002/abs(tracer));
	color = mix(color, 1.-color, tracer);
	color += overlay;// + tracer;
	gl_FragColor = color;
}