
uniform float time;
varying vec3 vColor, vNormal, vView, vWorld;
varying vec2 vUv, vScreen;

void main () {
	vec3 normal = normalize(vNormal);
	vec3 view = normalize(vView);
	float shade = dot(normal, -view)*2.+1.5;
	// shade *= dot(normal, view)*.5+.5;
	float fade = 1.-length(vUv*2.-1.);
	fade = smoothstep(.0, .5, fade);
	float salt = noise(vWorld * 100.);
	float dust = abs(sin(vWorld.y*10.+time*.2+vNormal.y*10.));
	vec3 color = vec3(0.968, 0.792, 0.372);
	vec3 c = vec3(0.968, 0.909, 0.768);
	color = mix(color, c, abs(dot(normal, vec3(0,0,1))));
	// color = mix(color, c, abs(dot(normal, vec3(1,0,0))));
	color *= .5;

	color *= shade * fade;
	color = mix(color, c, smoothstep(.0, 1., .5/dust)*.05);
	color += smoothstep(.5,1.,salt)*.1;
	color = clamp(color, 0., 1.);
	gl_FragColor = vec4(color, 1);
}