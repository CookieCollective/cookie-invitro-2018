
uniform float time;
uniform sampler2D texturePanel;
uniform vec3 sun, panel, warningLight, dangerLight;
varying vec3 vNormal, vView, vWorld;
varying vec2 vUv;

void main () {
	float light = getSunLight(sun);
	vec3 normal = normalize(vNormal);
	vec3 view = normalize(vView);
	float shade = clamp(dot(normalize(sun), normal)*.25+.75, 0., 1.);
	vec3 color = texture2D(texturePanel, vUv).rgb;
	color = mix(color, colorSkyNight, .2);
	// color *= light;
	color *= shade;
	vec3 offset = vec3(0,.4,0);
	float waveWarning = warningLight.y;
	float waveDanger = dangerLight.y;
	float d = length(vWorld-panel-offset);
	float lightFade = (1.-light) * .5 * smoothstep(.15, .0, d);
  color += colorWarningLight * waveWarning * lightFade;
  color += colorDangerLight * waveDanger * lightFade;
	gl_FragColor = vec4(color, 1);
}