precision mediump float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 proj;
uniform mat4 view;

varying vec3 vposition;
varying vec3 vnormal;

void main() {
	vposition = position;
	vnormal = normalize(normal);
 	gl_Position = proj * view * vec4(position, 1.0);
}