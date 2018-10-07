
varying vec3 vColor, vNormal, vView;

void main () {
	// float shade = dot(normalize(vNormal), normalize(vView)) * .5 + .5;
	// float shade = 1.-abs(dot(normalize(vNormal), normalize(vView)));
	// shade = shade * .5 + .5;
	// shade = smoothstep(.0, .5, shade);
	gl_FragColor = vec4(luminance(vColor) * vec3(0.984, 0.690, 0.137) * 1.5,1);
}