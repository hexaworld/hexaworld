precision mediump float;

varying vec3 vposition;
varying vec3 vnormal;

uniform vec3 eye;
uniform vec3 light;
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
	vec3 lightdir = light - vposition;

	float diff = orenn(normalize(lightdir), normalize(viewdiff), vnormal, 0.9, 0.9);
	float spec = gauss(normalize(lightdir), normalize(viewdiff), vnormal, 1.0);

	float att = calcLightAttenuation(length(lightdir), 150.0, 1.0);
	vec3 lcol = vec3(0.6, 0.6, 0.6);

	vec3 material = color;

	vec3 result = (lit > 0.0) ? (att * lcol * vec3(material * diff + spec)) : material;

	// result = (vposition.x > 0.0) ? (vec3(0.0, 0.0, 0.0)) : result;
	
	// result = mix(result, vec3(0.1, 0.1, 0.1), fog(length(viewdiff), 0.005));

 	gl_FragColor = vec4(result, 1);
}