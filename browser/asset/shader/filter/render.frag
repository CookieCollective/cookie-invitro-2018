
uniform sampler2D frame, frameUI, curve, bloom, blur;
uniform vec2 resolution, mouse;
uniform float time;
uniform vec3 fade;
varying vec2 vUv;

void main () {
	vec2 p = vUv;
	p.x *= resolution.x/resolution.y;
	p = vUv * 2. - 1.;
	float salt = random(vUv);
	vec4 color = texture2D(bloom, vUv);
	vec4 blur = texture2D(blur, vUv);
	float dof = clamp(length(p), 0., 1.);
	// color.rgb = mix(color.rgb, blur.rgb, dof + .05 * salt);
	// color *= 1.+.1*sin(p.y*1000.);
	// color *= 1.+.1*random(p);
	color *= fade.y;
	gl_FragColor = color;
}