
uniform sampler2D frame, frameUI, curve, bloom, blur;
uniform vec2 resolution, mouse;
uniform float time;
varying vec2 vUv;

void main () {
	vec2 p = vUv;
	p.x *= resolution.x/resolution.y;
	p = vUv * 2. - 1.;
	vec4 color = texture2D(bloom, vUv);
	color *= 1.+.1*sin(p.y*1000.);
	color *= 1.+.1*random(p);
	gl_FragColor = color;
}