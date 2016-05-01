var fs_point_default = `
precision mediump float;
varying  vec4 color;
 
void
main()
{
    float r = 0.0, delta = 0.0, alpha = 1.0;

    gl_FragColor = color * (alpha);

}`;