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

void main() {
	vec3 viewdiff = eye - vposition;
	vec3 lightdir = light - vposition;

	float diff = orenn(normalize(lightdir), normalize(viewdiff), vnormal, 0.9, 0.9);
	float spec = gauss(normalize(lightdir), normalize(viewdiff), vnormal, 0.99);

	vec3 material = color;

	vec3 result = (lit > 0.0) ? (vec3(material * diff + spec)) : material;
	
	//result = mix(color, vec3(0.23, 0.23, 0.23), fog(length(viewdiff), 0.005));

 	gl_FragColor = vec4(result, 1);
}