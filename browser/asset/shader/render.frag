
uniform sampler2D frame, text;
uniform vec2 resolution, mouse;
uniform float time;
varying vec2 vUv;

void main () {

	vec2 uv;

	uv = vUv * 2. - 1.;
	uv.x *= resolution.x / resolution.y;
	uv.x *= 1024./2048.;
	uv /= .45;
	uv = uv * .5 + .5;
	float title = texture2D(text, uv).a;

	vec4 color = vec4(1);

	color.rgb = texture2D(frame, vUv).rgb;
	color.rgb = mix(color.rgb, vec3(1), title);

	gl_FragColor = color;
}