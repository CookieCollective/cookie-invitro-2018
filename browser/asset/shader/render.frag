
uniform sampler2D frame, uTitle, uDemo;
uniform vec2 resolution, mouse;
uniform float time;
varying vec2 vUv;

void main () {

	vec2 uv;
	float aspect, screen = resolution.x / resolution.y;

	uv = vUv * 2. - 1.;
	uv.x *= screen;
	aspect = 512./2048.;
	uv.x *= aspect;
	uv.y -= .1;
	uv /= .25;
	uv = uv * .5 + .5;
	float title = texture2D(uTitle, uv).a;

	uv = vUv * 2. - 1.;
	uv.x *= screen;
	aspect = 256./2048.;
	uv.x *= aspect;
	uv.y += .25;
	uv /= .125;
	uv = uv * .5 + .5;
	float demo = texture2D(uDemo, uv).a;

	vec4 color = vec4(1);

	color.rgb = texture2D(frame, vUv).rgb;
	color.rgb = mix(color.rgb, vec3(1), clamp(title+demo, 0., 1.));

	gl_FragColor = color;


	// vec2 p = vUv * 2. - 1.;
	// p.x *= resolution.x/resolution.y;
	// float neon = 4./resolution.y / max(p.x,0.);
	// gl_FragColor = mix(1.-gl_FragColor, gl_FragColor, clamp(neon, 0., 1.));
}