
uniform float time;
uniform vec3 satelitte, cameraPos;
varying vec2 vUv;
varying vec3 vNormal, vView;

// chunk(shadowmap_pars_vertex);

void main () {
	vec3 pos = position;
	pos += satelitte;
	pos.y += sin(length(pos.xz) * .1 + time) * 4.;
	vUv = uv;
	vNormal = normal;
	vView = cameraPos - pos;
  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  // chunk(shadowmap_vertex);
	gl_Position = projectionMatrix * viewMatrix * worldPosition;
}