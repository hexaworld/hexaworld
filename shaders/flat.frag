precision highp float;

varying vec3 vposition;
varying vec3 vnormal;

uniform vec3 eye;

uniform vec3 lpos1;
uniform vec3 lpos2;
uniform vec3 lpos3;
uniform vec3 lpos4;
uniform vec3 lpos5;

uniform vec3 lcol1;
uniform vec3 lcol2;
uniform vec3 lcol3;
uniform vec3 lcol4;
uniform vec3 lcol5;

uniform vec3 color;
uniform float lit;
uniform float ncol;

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

	vec3 ldiff1 = lpos1 - vposition;
	vec3 ldiff2 = lpos2 - vposition;
	vec3 ldiff3 = lpos3 - vposition;
	vec3 ldiff4 = lpos4 - vposition;
	vec3 ldiff5 = lpos5 - vposition;

	float diff1 = orenn(normalize(ldiff1), normalize(viewdiff), vnormal, 0.9, 0.9);
	float diff2 = orenn(normalize(ldiff2), normalize(viewdiff), vnormal, 0.9, 0.9);
	float diff3 = orenn(normalize(ldiff3), normalize(viewdiff), vnormal, 0.9, 0.9);
	float diff4 = orenn(normalize(ldiff4), normalize(viewdiff), vnormal, 0.9, 0.9);
	float diff5 = orenn(normalize(ldiff5), normalize(viewdiff), vnormal, 0.9, 0.9);

	float att1 = calcLightAttenuation(length(ldiff1), 100.0, 1.1);
	float att2 = calcLightAttenuation(length(ldiff2), 30.0, 1.1);
	float att3 = calcLightAttenuation(length(ldiff3), 30.0, 1.1);
	float att4 = calcLightAttenuation(length(ldiff4), 30.0, 1.1);
	float att5 = calcLightAttenuation(length(ldiff5), 30.0, 1.1);

	vec3 material = color;

	vec3 result = color;

	result = (lit > 0.0) ? mix(result, vec3(0.0392, 0.0392, 0.0392), fog(length(viewdiff), 0.01)) : result;

	result = (lit > 0.0 && ncol > 0.0) ? (result + 1.0 * att1 * diff1 * lcol1 * material) :  result;
	result = (lit > 0.0 && ncol > 1.0) ? (result + 8.0 * att2 * diff2 * lcol2 * material) :  result;
	result = (lit > 0.0 && ncol > 2.0) ? (result + 8.0 * att3 * diff3 * lcol3 * material) :  result;
	result = (lit > 0.0 && ncol > 3.0) ? (result + 8.0 * att4 * diff4 * lcol4 * material) :  result;
	result = (lit > 0.0 && ncol > 4.0) ? (result + 8.0 * att5 * diff5 * lcol5 * material) :  result;

 	gl_FragColor = vec4(result, 1);
}