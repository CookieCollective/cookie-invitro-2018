
uniform float time;
varying vec3 vColor, vNormal, vView, vWorld;
varying vec2 vUv, vScreen;

float fbm (vec2 p) {
    float value = 0.0;
    float amplitud = .5;
    for (float i = 3.; i >= 1.; --i) {
        value += amplitud * noise(p);
        p *= 2.;
        p += sin(length(p)-time*2.);
        amplitud *= .5;
    }
    return value;
}

float spike_hash(float n) { return pow(fract(sin(n) * 1e4), 100.0); }
float spike_noise(vec3 x) {
    const vec3 step = vec3(110, 241, 171);
    vec3 i = floor(x);
    vec3 f = fract(x);
    float n = dot(i, step);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix( spike_hash(n + dot(step, vec3(0, 0, 0))), spike_hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( spike_hash(n + dot(step, vec3(0, 1, 0))), spike_hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( spike_hash(n + dot(step, vec3(0, 0, 1))), spike_hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( spike_hash(n + dot(step, vec3(0, 1, 1))), spike_hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

void main () {
	vec2 grad = vec2(length(dFdx(vWorld)), length(dFdy(vWorld)));
	float prefilter1 = 1. / (1.0 + length(grad * 5.0)); // pour éviter de voir le grain au loin
	float prefilter2 = 1. / (1.0 + length(grad * 5.0));
	float fog = log(1. + length(vView));

	vec3 normal = normalize(vNormal);
	vec3 view = normalize(vView);
	float spec = max(0., dot(view, normal));

	float salt = noise(vWorld * 100.);
	//salt = fbm(vWorld.xz * 20.) * 0.5 + 0.5;
	salt *= prefilter1;

	vec3 spike_color = vec3(0.82, 0.64, 0.40);
	spike_color = vec3(0.5);
	vec3 yellow1 = vec3(0.77, 0.56, 0.18);
	vec3 yellow2 = vec3(0.75, 0.52, 0.17);


	vec3 color = vec3(0);
	color = mix(yellow1, yellow2, salt);
	color = clamp(color, 0., 1.);

	vec3 half_floored = mix(vWorld * 100., floor(vWorld * 100.), pow(prefilter1, 3.5));
	float spike = step(0.6, spike_noise(vWorld * 100.));
	float nx = noise(vWorld * 50.);
	float nz = noise(vWorld * 50. + vec3(12., 1.33, 0.966));
	vec3 spike_normal = normalize(vec3(nx * 2. - 1., 1., nz * 2. - 1.));
	float spike_spec = max(0., dot(view, spike_normal));
	spike = spike_noise(vWorld * 100.);
	spike *= prefilter2;
	color += spike_color * 1.0 * pow(spike_spec, 7.0) * pow(spike, 1.0);
	//color *= fog;
	gl_FragColor = vec4(color, 1);
}