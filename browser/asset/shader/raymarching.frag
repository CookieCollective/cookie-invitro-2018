
uniform vec3 cameraPos, cameraTarget;
uniform vec2 resolution;
uniform float time;

// Geometry
float range = .8;
float radius = .4;
float blend = .3;
const float count = 8.;

// Light
vec3 lightPos = vec3(1, 1, 1);
float specularSharpness = 10.;
float glowSharpness = 1.;

// Colors
vec3 ambient = vec3(.2);
vec3 light = vec3(0);
vec3 specular = vec3(1);
vec3 glow = vec3(0);

// Raymarching
const float epsilon = .001;
const float steps = 100.;
const float far = 100.;

float geometry (vec3 pos)
{
	float scene = 10.;
	vec3 p = pos;
	for (float index = count; index > 0.; --index) {
		float ratio = index / count;
		
		// easing
		ratio *= ratio;
		float iratio = 1.-ratio;
		
		// domain reptition and translation offset
		p.xz = abs(p.xz) - range * ratio;
		
		// rotations
		p.xz *= rot(PIQUART);
		// p.yz *= rot(PIQUART);
		// p.yx *= rot(PIHALF);

		// scene = min(scene, max(p.x,p.z));
		scene = min(scene, max(abs(p.x)-.1*ratio, abs(p.y)-2.*iratio));
		// scene = smoothmin(scene, box(p, vec3(radius * ratio)), blend * ratio);
	}
	scene = max(scene, box(pos, vec3(4)));
	return scene;
}

vec3 getNormal (vec3 p) {
	vec2 e = vec2(epsilon,0);
	return normalize(vec3(geometry(p+e.xyy)-geometry(p-e.xyy), geometry(p+e.yxy)-geometry(p-e.yxy), geometry(p+e.yyx)-geometry(p-e.yyx)));
}

void raymarching (vec3 pos, vec3 ray, inout vec4 hit)
{
	float total = 0.;
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
	// gl_FragColor.rgb = normal * .5 + .5;
	gl_FragColor.rgb *= pow(hit.w, 1./2.2);
}