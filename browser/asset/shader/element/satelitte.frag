
uniform sampler2D textureSatelitte;
uniform vec3 sun;
varying vec3 vNormal, vView;
varying vec2 vUv;

// chunk(common);
// chunk(packing);
// chunk(bsdfs);
// chunk(lights_pars_begin);
// chunk(shadowmap_pars_fragment);
// chunk(shadowmask_pars_fragment);

void main () {
	float light = getSunLight(sun);
	float shade = clamp(dot(normalize(sun), vNormal), 0., 1.);
	vec3 color = vec3(1);//texture2D(textureSatelitte, vUv).rgb;
	color *= light;
	color *= shade;
  // color *= ( getShadowMask() );
	gl_FragColor = vec4(color, 1);
}