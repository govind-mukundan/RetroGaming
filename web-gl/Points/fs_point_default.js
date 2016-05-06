var fs_point_default = `
precision mediump float;
varying  vec4 color;
 
void
main()
{
    float alpha = 1.0;
    gl_FragColor = color * (alpha);
}`;