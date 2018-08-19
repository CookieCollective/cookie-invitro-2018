
uniform sampler2D frame;
uniform vec2 resolution;
varying vec2 vUv;

void main () {
	vec2 uv = vUv;
	gl_FragColor = texture2D(frame, uv);
}