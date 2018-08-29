
varying vec2 vAnchor;
varying vec3 vCameraDir;

void main () {
	float dist = length(vAnchor);
	if (dist > 1.) discard;
	float alpha = (1.-dist)*2./dist;
	alpha = clamp(alpha,0.,1.)*.1;
	alpha *= abs(dot(normalize(vCameraDir), vec3(0,1,0)));
	gl_FragColor = vec4(1,1,1,alpha);
}