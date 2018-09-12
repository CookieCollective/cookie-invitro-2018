
uniform sampler2D frame, frameUI, curve, bloom, blur;
uniform vec2 resolution;
uniform float time;
varying vec2 vUv;

float sdbox (vec2 p, vec2 r) { vec2 d = abs(p)-r; return max(d.x, d.y); }

void main () {
	vec2 uv = vUv;
	float dof = clamp(length(uv-.5), 0., 1.);
	vec4 color = vec4(0);
	float unit = 1./resolution.y;
	// vec2 offset = vec2(1,0) * unit;
	vec2 p = uv-.5;
	p.x *= resolution.x/resolution.y;
	// float radius = 20.;// + 10. * sin(atan(p.y,p.x) * 1000.);
	// vec2 offset = normalize(p) * unit * radius;
	// color.r += texture2D(blur, uv-offset).r;
	// offset = normalize(p) * unit * radius * 2.;
	// color.g += texture2D(blur, uv-offset).g;
	// offset = normalize(p) * unit * radius * 3.;
	// color.b += texture2D(blur, uv-offset).b;

	// color = mix(texture2D(frame, uv), texture2D(blur, uv), dof);
	// color = texture2D(frame, uv) + color * dof;
	// radius = 30. + 100. * sin(atan(p.y,p.x) * 1000.);
	// offset = normalize(p) * unit * radius;
	// vec4 c = texture2D(frame, uv) + texture2D(frame, uv-offset)*.25;
	// color = c;
	// color = mix(texture2D(frame, uv), texture2D(bloom, uv), dof) + color * dof;
	// color = mix(texture2D(frame, uv), texture2D(bloom, uv), dof) + color * dof;
	color += texture2D(bloom, uv);
	// color = texture2D(frame, uv);

	vec3 background = mix(vec3(1,0,0),vec3(0),uv.y);
	// uv.x = (uv.x-.5)*resolution.x/resolution.y+.5;
	// vec4 overlay = texture2D(text, uv);
	vec4 overlay = vec4(0);
	p = uv * 2. - 1.;
	// color *= 1.-(abs(p.x)*abs(p.x)*abs(p.x)*abs(p.x));
	// color *= 1.-(abs(p.y)*abs(p.y)*abs(p.y)*abs(p.y));
	color *= 1.+.1*sin(p.y*1000.);
	color *= 1.+.1*random(p);
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
	// float tracer = sdbox(p, vec2(.9, .7));
	// tracer = smoothstep(.0, 1., .002/abs(tracer));
	// color = clamp(color, 0., 1.);
	// color = mix(color, 1.-color, tracer);
	color += overlay;// + tracer;
	gl_FragColor = color;
}