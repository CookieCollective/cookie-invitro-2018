
attribute vec3 color;
uniform float time;
uniform vec3 cameraPos;
varying vec3 vColor, vNormal, vView, vWorld;
varying vec2 vUv, vScreen;

// chunk(fog_pars_vertex);
// chunk(shadowmap_pars_vertex);

float fbm (vec2 p) {
    float value = 0.0;
    float amplitud = .5;
    for (float i = 3.; i >= 1.; --i) {
        value += amplitud * noise(p);
        p *= 2.;
        // p += sin(length(p)-time*.5);
        amplitud *= .5;
    }
    return value;
}

void displace (inout vec3 pos) {
	vec2 p = uv*2.-1.;
	float fade = abs(p.x)*abs(p.y);
	float noisy = fbm(pos.xz*.1);
	noisy = abs(noisy*2.-1.);
	pos.y += noisy * 2.;
}

void main () {
	vec3 pos = position;
	pos.xyz = vec3(pos.x, pos.z, -pos.y);
	vec2 delta = vec2(2.,0);
	vec3 north = pos + delta.yyx;
	vec3 south = pos - delta.yyx;
	vec3 east = pos + delta.xyy;
	vec3 west = pos - delta.xyy;
	displace(pos);
	displace(north);
	displace(south);
	displace(east);
	displace(west);
	vNormal = normalize(cross(north-south, east-west));
	vView = cameraPos - pos;
	vColor = color;
	vUv = uv;
	vWorld = pos;
  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  // chunk(shadowmap_vertex);
	gl_Position = projectionMatrix * viewMatrix * worldPosition;
	vScreen = gl_Position.xy;
}