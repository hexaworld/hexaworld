precision mediump float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 proj;
uniform mat4 view;

varying vec3 anormal;

void main() {
  gl_Position = proj * view * vec4(position, 1.0);
}