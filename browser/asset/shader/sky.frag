
uniform vec3 sun;

varying vec3 vView, vPos;

void main () {
	vec3 color = blue1;
	vec3 view = normalize(vView);
	// float horizon = abs(dot(view, vec3(0,1,0)));
	float horizon = clamp(vPos.y * .002, 0., 1.);
	float light = getSunLight(sun);
	color = mix(orange1, color, horizon);
	color *= light;
	gl_FragColor = vec4(color, 1);
}