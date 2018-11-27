
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
	float r = uiTime.y * 2.;//sin(timeLoop * .1);
	float a = r * TAU - PIHALF;
	vec2 offset = vec2(cos(a), sin(a)) * r;
	p += offset;
	shade += .02 / abs(sin(pp.x*(20.*abs(r))));
	shade += .02 / abs(sin(pp.y*(20.*abs(r))));
	
	shape = step(abs(r), length(pp));
	shade = shade * shape;// + c01(.002 / abs(length(pp)-abs(r)));

	const float count = 5.;
	for (float i = count; i > 0.; --i) {
		vec2 ppp = mix(p, pp, i / count);
		shade += .001 / abs(length(ppp)-abs(r)*i*.2);
		shade += smoothstep(.05/i, .04/i, length(ppp));
	}

	// shade += (1.-shape) * .05 / abs(sin(length(pp)*40.*abs(r)-timeLoop));

	// pp = vec2(atan(pp.y, pp.x), length(pp));
	// pp.x += (pp.y * 2.);
	// shade += (1.-shape) * .02 / pp.y / abs(sin(pp.x*8.));

	shade += .01 / abs(smoothstep(.02, .06, length(p)));

	p *= rot(-a);
	// pModPolar(p, 4.);
	shade += .001 / abs(p.y);
	shade += .001 / max(step(mod(p.y+.02, .1),.04), abs(p.x));
	shade = clamp(shade, 0., 1.);
	return vec3(shade);
}

void main () {
	vec2 p = vUv;
	p = vUv * 2. - 1.;
	p.x *= resolution.x/resolution.y;
	float salt = random(vUv);
	vec4 color = texture2D(bloom, vUv);
	// vec4 blur = texture2D(blur, vUv);
	// float dof = clamp(length(p), 0., 1.);
	// color.rgb = mix(color.rgb, blur.rgb, dof + .05 * salt);
	// color *= 1.+.1*sin(p.y*10000.+time);
	// color *= 1.+.1*random(p+time);

	if (boom.y <= 0.01) {

		color.rgb += makeUI(p) * ui.z;

	} else {

		vec3 blu = texture2D(blur, vUv).rgb;
		blu = mix(blu, smoothstep(.3, .8, blu), smoothstep(.8, 1., boom.y));
		color.rgb = mix(color.rgb, blu, smoothstep(.3, .8, boom.y));

		// color.rgb = texture2D(blur, vUv).rgb;
		// const float count = 10.;
		// color = vec4(0);
		// vec2 unit = 1./resolution;
		// for(float i = count; i > 0.; --i) {
		// 	vec2 offset = -normalize(p)*unit*i*2.*rays.y;
		// 	color += texture2D(bloom, vUv + offset) / count;
		// }
	}

	color *= fade.y;
	gl_FragColor = color;
}