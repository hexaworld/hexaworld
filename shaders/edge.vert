precision highp float;

attribute vec3 position;

uniform mat4 proj;
uniform mat4 view;

varying vec3 vposition;

void main() {
	vposition = position;
 	gl_Position = proj * view * vec4(position, 1.0);
}