
uniform sampler2D frame, frameUI, curve, bloom, blur;
uniform vec2 resolution, mouse;
uniform float time, timeLoop;
uniform vec3 fade, ui, uiTime, boom, rays;
varying vec2 vUv;

#define c01(v) clamp(v,0.,1.)

vec3 makeUI (vec2 p) {
	float shade = 0.;
	float shape = 0.;
	vec2 pp = p;
	float r = uiTime.y;//sin(timeLoop * .1);
	float a = r * TAU - PIHALF;
	vec2 offset = vec2(cos(a), sin(a)) * r;
	p += offset;
	shade += .04 / max(.01, abs(sin(pp.x*pp.y*(80.*abs(r)))));
	// shade += .01 / abs(sin(pp.y*(40.*abs(r))));
	
	shape = step(abs(r), length(pp));
	shade = shade * shape + c01(.002 / abs(length(pp)-abs(r)));

	const float count = 10.;
	vec2 lp = pp;
	for (float i = count-1.; i > 0.; --i) {
		float ratio = i / count;
		pp *= rot(uiTime.y * 2. / ratio);
		// vec2 ppp = mix(p, pp, i / count);
		vec2 ppp = p - normalize(pp) * ratio;
		shade += .002 / abs(length(ppp)-abs(r)*i*.2);
		// ppp.x = repeat(ppp.x, .5);
		// shade += smoothstep(.005*i, .004*i, length(ppp));
	}

	// shade += (1.-shape) * .05 / abs(sin(length(pp)*40.*abs(r)-timeLoop));

	// pp = vec2(atan(pp.y, pp.x), length(pp));
	// pp.x += (pp.y * 2.);
	// shade += (1.-shape) * .02 / pp.y / abs(sin(pp.x*8.));

	// shade += .01 / abs(smoothstep(.02, .06, length(p)));

	p *= rot(-a);
	// pModPolar(p, 4.);
	shade += .002 / max(.01, r) / abs(p.y);
	// shade += .001 / max(step(mod(p.y+.02, .1),.04), abs(p.x));
	shade = clamp(shade, 0., 1.);
	return vec3(shade);
}

vec2 getNormal (sampler2D map, vec2 p) {
	vec3 e = vec3(1. / resolution, 0.);
	return normalize(vec2(
			texture2D(map, p+e.xz).r-texture2D(map, p-e.xz).r,
			texture2D(map, p+e.zy).r-texture2D(map, p-e.zy).r
		));
}

void main () {
	vec2 p = vUv;
	p = vUv * 2. - 1.;
	p.x *= resolution.x/resolution.y;
	float salt = random(vUv);
	vec4 color = texture2D(bloom, vUv);
		vec2 unit = 1. / resolution;
	// vec4 blur = texture2D(blur, vUv);
	// float dof = clamp(length(p), 0., 1.);
	// color.rgb = mix(color.rgb, blur.rgb, dof + .05 * salt);
	// color *= 1.+.1*sin(p.y*10000.+time);
	// color *= 1.+.1*random(p+time);

	if (boom.y <= 0.01) {

		color.rgb += makeUI(p) * ui.z;

	} else {

		vec3 blu = texture2D(blur, vUv).rgb;

		blu.r += random(vUv) * .1;
		blu.r = mix(smoothstep(.4, 1.2, blu.r), blu.r, rays.y);
		// blu.rgb = vec3(sqrt(blu.r));
		// blu.r += .01/abs(abs(blu.r-.5));
		blu.rgb = vec3(blu.r);
		blu += color.rgb*.3;
		// blu = mix(blu, smoothstep(.3, .8, blu), smoothstep(.9, 1., boom.y));
		color.rgb = mix(color.rgb, blu, smoothstep(.1, .8, boom.y));
		// color.rgb = 1.-color.rgb;

		// vec2 normal = getNormal(blur, vUv);
		// float shade = dot(vec3(normal,0), -vec3(0,1,0));
		// color = vec4(shade);
		// color *= .5+.5*sin(shade*PI);

		// color.rgb = texture2D(blur, vUv).rgb;
		const float count = 10.;
		// color = vec4(0);
		// vec2 unit = 1./resolution;
		for(float i = count; i > 0.; --i) {
			vec2 offset = -normalize(p)*unit*i*4.;
			color -= smoothstep(.9, 0., texture2D(bloom, vUv + offset))*rays.y / count;
		}
		color.rgb = vec3(1.-c01(abs(sin(color.r*2. + time))));
	}
	// const float count = 10.;
	// for(float i = count; i > 0.; --i) {
	// 	vec2 offset = -normalize(p)*unit*i*20.;
	// 	color += luminance(texture2D(blur, vUv + offset).rgb) / count;
	// }
	// color = mod(color*.5 + time, 1.);

	color *= fade.y;
	gl_FragColor = color;
}