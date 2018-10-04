
uniform float time;
uniform vec3 sun, moon;

varying vec3 vView, vPos;

void main () {
	vec3 color = blue1;
	vec3 view = normalize(vView);
	// float horizon = abs(dot(view, vec3(0,1,0)));
	float salt = random(vView.xz);
	float horizon = clamp(vPos.y * .002 + .1*salt, 0., 1.);
	float ground = clamp(vPos.y, 0., 1.);
	float light = getSunLight(sun);
	color = mix(colorDesert, color, horizon);
	// color = mix(colorDesert, color, ground);
	vec3 dirSun = normalize(cross(normalize(sun), vView));;
	float angle = atan(dirSun.x, dirSun.y);
	float thinSun = .0001+.0001*abs(sin(angle*20.)*sin(angle*5.)*sin(angle*40.));
	float shapeSun = thinSun/(dot(normalize(sun), view)+1.);
	float dotMoon = dot(normalize(moon), view)+1.;
	float shapeMoon = .001/(dotMoon);
	color += clamp(shapeSun, 0., 1.);
	color = mix(mix(colorSkyDark, colorSkyNight, horizon), color, light);
	color = mix(colorDesert * light, color, ground);

	shapeMoon = mix(shapeMoon, smoothstep(.001,.0009,dotMoon) * .1, light);
	color += clamp(shapeMoon, 0., 1.);

	gl_FragColor = vec4(color, 1);
}