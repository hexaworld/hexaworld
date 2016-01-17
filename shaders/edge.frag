precision highp float;

varying vec3 vposition;
varying vec3 vnormal;

uniform vec3 eye;
uniform vec3 light;
uniform vec3 color;
uniform float lit;

float calcLightAttenuation(float lightDistance, float cutoffDistance, float decayExponent) {
  if (decayExponent > 0.0) {
    return pow(clamp(-lightDistance / cutoffDistance + 1.0, 0.0, 1.0), decayExponent);
  }
  return 1.0;
}

void main() {
	vec3 viewdiff = eye - vposition;
	vec3 lightdir = light - vposition;

	float att = calcLightAttenuation(length(lightdir), 200.0, 0.5);

 	gl_FragColor = vec4(att * vec3(1.0, 1.0, 1.0), 1.0);
}