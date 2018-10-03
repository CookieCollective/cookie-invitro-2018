
uniform vec3 sun;
varying vec3 vNormal, vView;

void main () {
	vec3 view = normalize(vView);
	float shade = dot(vNormal, -view)*.5+.5;
	float light = clamp(dot(normalize(sun), vec3(0,1,0))*4., 0., 1.);
	shade = .05/shade;
	shade *= dot(vNormal, view)*.5+.5;
	shade *= light;
	gl_FragColor = vec4(1,1,1,shade);
}