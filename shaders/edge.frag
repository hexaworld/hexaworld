precision highp float;

varying vec3 vposition;

uniform vec3 eye;
uniform float lit;

#pragma glslify: fog = require('glsl-fog')

void main() {
	vec3 viewdiff = eye - vposition;

	vec3 result = vec3(1.0, 1.0, 1.0);

	result = (lit > 0.0) ? mix(result, vec3(0.0392, 0.0392, 0.0392), fog(length(viewdiff), 0.01)) : result;

 	gl_FragColor = vec4(result, 1.0);
}