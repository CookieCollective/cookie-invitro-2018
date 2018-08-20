
void main () {
	vec3 pos = position;
	float noisy1 = noise(pos*.1);
	float noisy2 = noise(pos*.2+vec3(1.321,9.2,5.239));
	pos.xz *= rotation(noisy1*.5);
	pos.xy *= rotation(noisy2*.5);
	float lod = 2.;
	pos = floor(pos * lod) / lod;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1);
}