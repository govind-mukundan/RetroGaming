var vs_points = `
attribute vec3 vPosition;
attribute vec4 vArgbColor;
attribute float vPointSize;
varying  vec4 color;
 
void
main()
{
    gl_Position =  vec4(vPosition, 1.0);
	//gl_PointSize = 10.0;
	gl_PointSize = vPointSize;
    color = vArgbColor;
	//color = vec4(1.0,0.0,0.0,1.0);
}`;