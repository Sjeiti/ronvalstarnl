
float sdPlane(vec3 p){
	return p.y;
}

float sdSphere(vec3 p, float s){
	return length(p)-s;
}

float sdBox(vec3 p, vec3 b){
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

float udRoundBox(vec3 p, vec3 b, float r){
    return length(max(abs(p)-b,0.0))-r;
}

float sdTorus(vec3 p, vec2 t){
    return length(vec2(length(p.xz)-t.x,p.y))-t.y;
}

float sdHexPrism(vec3 p, vec2 h){
	vec3 q = abs(p);
#if 0
	return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
#else
	float d1 = q.z-h.y;
	float d2 = max((q.x*0.866025+q.y*0.5),q.y)-h.x;
	return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
#endif
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r){
	vec3 pa = p-a, ba = b-a;
	float h = clamp(dot(pa,ba)/dot(ba,ba), 0.0, 1.0);
	return length(pa - ba*h) - r;
}

float sdTriPrism(vec3 p, vec2 h){
	vec3 q = abs(p);
#if 0
	return max(q.z-h.y,max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5);
#else
	float d1 = q.z-h.y;
	float d2 = max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5;
	return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
#endif
}

float sdCylinder(vec3 p, vec2 h){
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}


float sdCone(in vec3 p, in vec3 c){
	vec2 q = vec2(length(p.xz), p.y);
#if 0
	return max(max(dot(q,c.xy), p.y), -p.y-c.z);
#else
	float d1 = -p.y-c.z;
	float d2 = max(dot(q,c.xy), p.y);
	return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
#endif
}

float length2(vec2 p){
	return sqrt(p.x*p.x + p.y*p.y);
}

float length6(vec2 p){
	p = p*p*p; p = p*p;
	return pow(p.x + p.y, 1.0/6.0);
}

float length8(vec2 p){
	p = p*p; p = p*p; p = p*p;
	return pow(p.x + p.y, 1.0/8.0);
}

float sdTorus82(vec3 p, vec2 t){
    vec2 q = vec2(length2(p.xz)-t.x,p.y);
    return length8(q)-t.y;
}

float sdTorus88(vec3 p, vec2 t){
    vec2 q = vec2(length8(p.xz)-t.x,p.y);
    return length8(q)-t.y;
}

float sdCylinder6(vec3 p, vec2 h){
    return max(length6(p.xz)-h.x, abs(p.y)-h.y);
}