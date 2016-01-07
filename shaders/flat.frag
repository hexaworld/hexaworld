precision mediump float;

varying vec3 vposition;
varying vec3 vnormal;

uniform vec3 eye;
uniform vec3 light;

#pragma glslify: orenn = require('glsl-diffuse-oren-nayar')
#pragma glslify: gauss = require('glsl-specular-gaussian')
#pragma glslify: fog = require('glsl-fog')

void main() {
	vec3 viewdiff = eye - vposition;
	vec3 lightdir = light - vposition;

	float diff = orenn(normalize(lightdir), normalize(viewdiff), vnormal, 0.9, 0.9);
	float spec = gauss(normalize(lightdir), normalize(viewdiff), vnormal, 0.95);

	vec3 material = vec3(1) * 0.9;

	vec3 color = (
	    vec3(material * diff + spec)
	);

	color = mix(color, vec3(0.23, 0.23, 0.23), fog(length(viewdiff), 0.005));

 	gl_FragColor = vec4(color, 1);
}