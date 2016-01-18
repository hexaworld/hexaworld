precision highp float;

varying vec3 vposition;

uniform vec3 eye;
uniform vec3 light;
uniform vec3 light2;
uniform vec3 light3;
uniform vec3 light4;
uniform vec3 color;
uniform float lit;

#pragma glslify: orenn = require('glsl-diffuse-oren-nayar')
#pragma glslify: fog = require('glsl-fog')

float calcLightAttenuation(float lightDistance, float cutoffDistance, float decayExponent) {
  if (decayExponent > 0.0) {
    return pow(clamp(-lightDistance / cutoffDistance + 1.0, 0.0, 1.0), decayExponent);
  }
  return 1.0;
}

void main() {
	vec3 viewdiff = eye - vposition;
	vec3 lightdir = light - vposition;

	vec3 lightdir2 = light2 - vposition;
	vec3 lightdir3 = light3 - vposition;
	vec3 lightdir4 = light4 - vposition;

	float att2 = calcLightAttenuation(length(lightdir2), 30.0, 1.1);
	float att3 = calcLightAttenuation(length(lightdir3), 30.0, 1.1);
	float att4 = calcLightAttenuation(length(lightdir4), 30.0, 1.1);

	vec3 lcol2 = vec3(0.87, 0.52, 0.22);
	vec3 lcol3 = vec3(0.0, 0.76, 0.93);
	vec3 lcol4 = vec3(0.81, 0.33, 0.34);

	vec3 material = color;

	vec3 result = vec3(1.0, 1.0, 1.0);

	result = (lit > 0.0) ? mix(result, vec3(0.0392, 0.0392, 0.0392), fog(length(viewdiff), 0.01)) : result;

	// result = (lit > 0.0) ? (result + 0.006 * att2 * lcol2 * material) :  result;
	// result = (lit > 0.0) ? (result + 0.006 * att3 * lcol3 * material) :  result;
	// result = (lit > 0.0) ? (result + 0.006 * att4 * lcol4 * material) :  result;

 	gl_FragColor = vec4(result, 1.0);
}