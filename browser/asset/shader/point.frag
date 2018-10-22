
varying vec2 vAnchor;

void main () {
	float dist = length(vAnchor) * 4.;
	dist = smoothstep(1., .5, dist);
	gl_FragColor = vec4(1,1,1,dist);
}