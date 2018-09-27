
attribute vec3 color;
uniform float time;
uniform vec3 cameraPos;
varying vec3 vColor, vNormal, vView, vWorld;
varying vec2 vUv, vScreen;

float fbm (vec2 p) {
    float value = 0.0;
    float amplitud = .5;
    for (float i = 3.; i >= 1.; --i) {
        value += amplitud * noise(p);
        p *= 2.;
        p += sin(length(p)-time*.5);
        amplitud *= .5;
    }
    return value;
}

void displace (inout vec3 pos) {
	return;
	vec2 p = uv*2.-1.;
	// float fade = (1.-abs(p.x))*(1.-abs(p.y));
	float fade = abs(p.x)*abs(p.y);
	float noisy = fbm(pos.xz*.25);
	noisy = abs(noisy*2.-1.);
	// noisy = clamp(.01/noisy, 0., 1.);
	pos.y += noisy - fade;// * (.5 + fade) + fade;
}

void main () {
	vec3 pos = position;
	pos.xyz = vec3(pos.x, pos.z, -pos.y);
	pos.y -= 2.;
	vec2 delta = vec2(.5,0);
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
	gl_Position = projectionMatrix * viewMatrix * vec4(pos, 1);
	vScreen = gl_Position.xy;
}