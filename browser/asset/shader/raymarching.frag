
uniform vec3 cameraPos, cameraTarget;
uniform vec2 resolution;
uniform float time, rotation1, rotation2, rotation3, blend, range, radius, height, thin, count;

// Geometry
// float range = .8;
// float radius = .4;
// float height = .001;
// float thin = .5;
// float blend = .01;
// const float count = 12.;

// Light
vec3 lightPos = vec3(1, 2, 1) * 8.;
float specularSharpness = 10.;
float glowSharpness = 1.;

// Colors
vec3 ambient = vec3(.0);
vec3 light = vec3(1);
vec3 specular = vec3(.1);
vec3 glow = vec3(.5);

// Raymarching
const float epsilon = .001;
const float steps = 100.;
const float far = 100.;

float geometry (vec3 pos)
{
	float scene, shape, h, r, rr, b, c, hole, crop;
	scene = shape = hole = crop = 10.;
	vec3 p = pos;
	vec2 tt, e;
	c = ceil(count);
	float wave1 = sin(-time+length(pos));
	for (float index = 20.; index > 0.; --index) {
		if (20. - index > c) break;
		float ratio = index / c;
		
		// easing
		ratio *= ratio;
		float iratio = 1.-ratio;
		float blend1 = smoothstep(.9, .0, ratio);
		float blend2 = smoothstep(.5, 1., ratio);
		
		// domain reptition and translation offset
		float salt = random(vec2(ratio)*sign(p.xz));
		p.x = abs(p.x) - range * ratio;// * (.5+.5*wave1);
		
		// rotations
		// p.xz *= rot(PIHALF + ratio * TAU + time * .1);
		// p.yz *= rot(-PIHALF * ratio);
		// p.xy *= rot(ratio * TAU + time * blend2 * .1);
		p.xy *= rot((rotation3*ratio));
		p.xz *= rot((rotation1*ratio));
		p.yz *= rot((rotation2*ratio));
		// p.yz *= rot(sin(-time+length(p))*.2*ratio);

		// p.xz *= rot(salt);
		// p.x += sin(ratio*TAU+time) * .1 * ratio;
		// p.yz *= rot(time*.5);
		// p.xz *= rot(sin(time*.5) * PI);
		// p.yx *= rot(PIHALF);

		// scene = min(scene, max(p.x,p.z));
		// scene = min(scene, max(abs(p.x)-.1*ratio, abs(p.y)-2.*iratio));
		// scene = smoothmin(scene, box(p, vec3(radius * ratio)), blend * ratio);
		r = radius * ratio;
		rr = r * (1.-thin);
		h = height * ratio;
		b = blend * ratio;// * (1. + .5 * wave1);
		tt = vec2(r,thin*ratio);
		// shape = smoothmin(torus(p, tt), smoothmin(torus(p.xzy, tt), torus(p.zxy, tt), b/3.), b/3.);
		// shape = smoothmin(sdist(p.xz, r * thin), shape, b/3.);
		// shape = max(max(abs(p.x)-h, sdist(p.xy, r)), -sdist(p.xy, rr));
		// shape = max(max(abs(p.z)-h, sdist(p.xy, r)), -sdist(p.xy, rr));
		// shape = max(max(abs(p.x)-h, sdist(p.xy, r)), -sdist(p.xy, rr));
		shape = smoothmin(smoothmin(sdist(p.yz, r), sdist(p.xz, r), b), sdist(p.yx, r), b);
		crop = box(p, vec3(h));
		// hole = min(max(crop, min(min(sdist(p.yz, rr), sdist(p.xz, rr)), sdist(p.yx, rr))), hole);
		hole = min(hole, smoothmin(smoothmin(sdCapsule(p, e.xyy, -e.xyy, rr), sdCapsule(p, e.yxy, -e.yxy, rr), b), sdCapsule(p, e.yyx, -e.yyx, rr), b));
		e = vec2(h,0);
		// hole = min(hole, sdCapsule(p, p+e.xyy, p-e.xyy, rr));
		shape = max(crop, shape);
		// scene = min(shape, scene);
		scene = smoothmin(shape, scene, b);
		// shape = min(
		// 						max(max(abs(p.x)-h, sdist(p.yz, r)), -sdist(p.yz, rr)),
		// 				min(max(max(abs(p.z)-h, sdist(p.yx, r)), -sdist(p.yx, rr)),
		// 						max(max(abs(p.y)-h, sdist(p.xz, r)), -sdist(p.xz, rr))));
		// shape = max(max(p.x, p.y), p.z);
		// scene = smoothmin(scene, shape, b);
	}
	scene = max(-hole, scene);
	// scene = max(scene, box(pos, vec3(10)));
	scene = max(scene, -sdist(pos-cameraPos, 1.));
	return scene;
}

vec3 getNormal (vec3 p) {
	vec2 e = vec2(epsilon,0);
	return normalize(vec3(geometry(p+e.xyy)-geometry(p-e.xyy), geometry(p+e.yxy)-geometry(p-e.yxy), geometry(p+e.yyx)-geometry(p-e.yyx)));
}

float getShadow (vec3 pos, vec3 at, float k) {
    vec3 dir = normalize(at - pos);
    float maxt = length(at - pos);
    float f = 1.;
    float t = epsilon*10.;
    for (int i = 50; i > 0; --i) {
        float dist = geometry(pos + dir * t);
        if (dist < epsilon) return 0.;
        f = min(f, k * dist / t);
        t += dist;
        if (t >= maxt) break;
    }
    return f;
}

void raymarching (vec3 pos, vec3 ray, inout vec4 hit)
{
	float total = 0.;
	float dither = random(ray.xz);
	for (float i = steps; i >= 0.; --i) {
		float dist = geometry(pos);
		hit.xyz = pos;
		if (dist < epsilon * total) {
			hit.w = i/steps;
			break;
		}
		if (total > far) {
			hit.w = 0.;
			break;
		}
		dist *= .5 + .1 * dither;
		total += dist;
		pos += ray * dist;
	}
}

void main ()
{    
	vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	vec4 hit;

	// lightPos.xz *= rot(time);

	vec3 ray = look(cameraPos, cameraTarget, uv);
	raymarching(cameraPos, ray, hit);

	vec3 pos = hit.xyz;
	vec3 normal = getNormal(pos);
	vec3 lightDir = normalize(lightPos);
	float lightIntensity = clamp(dot(lightDir, normal),0.,1.);
	float specularIntensity = saturate(pow(max(0., dot(reflect(lightDir, normal), ray)), specularSharpness));
	float glowIntensity = saturate(pow(abs(1.-abs(dot(normal, ray))), glowSharpness));

	gl_FragColor = vec4(1);
	gl_FragColor.rgb = ambient + light * lightIntensity + specular * specularIntensity + glow * glowIntensity;
	gl_FragColor.rgb *= .4 + .6 * getShadow(pos, lightPos, 40.);
	// gl_FragColor.rgb = normal * .5 + .5;
	gl_FragColor.rgb *= pow(hit.w, 1./2.2) * .6;
}