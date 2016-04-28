#version 330
 
in vec3 vPosition;
in vec4 vArgbColor;
out vec4 color;


 
void
main()
{
    gl_Position =  vec4(vPosition, 1.0);
    color = vArgbColor;
}