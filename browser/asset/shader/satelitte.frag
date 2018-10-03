
uniform sampler2D textureSatelitte;
uniform vec3 sun;
varying vec3 vNormal, vView;
varying vec2 vUv;

void main () {
	float light = getSunLight(sun);
	vec3 color = texture2D(textureSatelitte, vUv).rgb;
	color *= light;
	gl_FragColor = vec4(color, 1);
}