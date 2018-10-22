
const float PI = 3.14159; const float PI2 = 6.28318; const float TAU = 6.28318; const float HALFPI = 1.57079; const float PIHALF = 1.57079; const float PIQUART = 0.785397; const float HALF3PI = 4.71238;
float random (in vec2 st) { return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123); }
vec3 lookAt (vec3 eye, vec3 target, vec2 anchor) {
	vec3 forward = normalize(target-eye);
	vec3 right = normalize(cross(forward, vec3(0,1,0)));
	vec3 up = normalize(cross(right, forward));
	return normalize(forward + right * anchor.x + up * anchor.y);
}
mat2 rotation (float a) { float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(oc*axis.x*axis.x + c, oc*axis.x*axis.y - axis.z*s, oc*axis.z*axis.x + axis.y*s, 0.0,
                oc*axis.x*axis.y + axis.z*s, oc*axis.y*axis.y + c, oc*axis.y*axis.z - axis.x*s, 0.0,
                oc*axis.z*axis.x - axis.y*s, oc*axis.y*axis.z + axis.x*s, oc*axis.z*axis.z + c, 0.0,
                0.0, 0.0, 0.0, 1.0);
}
