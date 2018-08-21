
varying vec3 vView;
varying vec2 vScreen;

void main () {
	// float shade = dot(normalize(vView), vec3(1,0,0));
	// float shade = smoothstep(.0, .5, length(vScreen)*.0005);
	gl_FragColor = vec4(.5);
}