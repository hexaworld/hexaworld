precision highp float;

varying vec3 vposition;
varying vec3 vnormal;

uniform vec3 eye;
uniform vec3 light1;
uniform vec3 light2;
uniform vec3 light3;
uniform vec3 light4;
uniform vec3 light5;
uniform vec3 color;
uniform float lit;

#pragma glslify: orenn = require('glsl-diffuse-oren-nayar')
#pragma glslify: gauss = require('glsl-specular-gaussian')
#pragma glslify: fog = require('glsl-fog')

float calcLightAttenuation(float lightDistance, float cutoffDistance, float decayExponent) {
  if (decayExponent > 0.0) {
    return pow(clamp(-lightDistance / cutoffDistance + 1.0, 0.0, 1.0), decayExponent);
  }
  return 1.0;
}

void main() {
	vec3 viewdiff = eye - vposition;

	vec3 lightdir1 = light1 - vposition;
	vec3 lightdir2 = light2 - vposition;
	vec3 lightdir3 = light3 - vposition;
	vec3 lightdir4 = light4 - vposition;
	vec3 lightdir5 = light5 - vposition;

	float diff1 = orenn(normalize(lightdir1), normalize(viewdiff), vnormal, 0.9, 0.9);
	float diff2 = orenn(normalize(lightdir2), normalize(viewdiff), vnormal, 0.9, 0.9);
	float diff3 = orenn(normalize(lightdir3), normalize(viewdiff), vnormal, 0.9, 0.9);
	float diff4 = orenn(normalize(lightdir4), normalize(viewdiff), vnormal, 0.9, 0.9);
	float diff5 = orenn(normalize(lightdir5), normalize(viewdiff), vnormal, 0.9, 0.9);

	float att1 = calcLightAttenuation(length(lightdir1), 100.0, 1.1);
	float att2 = calcLightAttenuation(length(lightdir2), 30.0, 1.1);
	float att3 = calcLightAttenuation(length(lightdir3), 30.0, 1.1);
	float att4 = calcLightAttenuation(length(lightdir4), 30.0, 1.1);
	float att5 = calcLightAttenuation(length(lightdir5), 30.0, 1.1);

	vec3 lcol1 = vec3(1.0, 1.0, 1.0);
	vec3 lcol2 = vec3(0.87, 0.52, 0.22);
	vec3 lcol3 = vec3(0.0, 0.76, 0.93);
	vec3 lcol4 = vec3(0.81, 0.33, 0.34);
	vec3 lcol5 = vec3(0.51, 0.79, 0.29);

	vec3 material = color;

	vec3 result = (lit > 0.0) ? (lcol1 * material) : material;

	// result = (vposition.x > 0.0) ? (vec3(0.0, 0.0, 0.0)) : result;
	
	result = (lit > 0.0) ? mix(result, vec3(0.0392, 0.0392, 0.0392), fog(length(viewdiff), 0.01)) : result;

	result = (lit > 0.0) ? (result + 1.0 * att1 * diff1 * lcol1 * material) :  result;
	result = (lit > 0.0) ? (result + 8.0 * att2 * diff2 * lcol2 * material) :  result;
	result = (lit > 0.0) ? (result + 8.0 * att3 * diff3 * lcol3 * material) :  result;
	result = (lit > 0.0) ? (result + 8.0 * att4 * diff4 * lcol4 * material) :  result;
	result = (lit > 0.0) ? (result + 8.0 * att5 * diff5 * lcol5 * material) :  result;

 	gl_FragColor = vec4(result, 1);
}