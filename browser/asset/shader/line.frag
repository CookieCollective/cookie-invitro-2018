
varying vec2 vAnchor;

void main () {
	float dist = abs(vAnchor.x);
	dist = (1.-dist)*.1/dist;
	gl_FragColor = vec4(1, 0.380, 0.019,dist);
}