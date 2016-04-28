#version 330
 
in vec3 vPosition;
in  vec3 vColor;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
attribute vec2 vTextureCoord;
attribute vec3 vSurfaceNormal;


 
out vec3 Position;
out vec4 color;
varying highp vec2 fTextureCoord;

void
main()
{
    gl_Position =  projectionMatrix * viewMatrix * modelMatrix * vec4(vPosition, 1.0);
 
    color = vec4( vColor, 1.0);
    fTextureCoord = vTextureCoord;
    //fTextureCoord = vPosition.xy * vec2(0.5) + vec2(0.5);

}
