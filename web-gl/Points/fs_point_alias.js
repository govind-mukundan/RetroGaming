var fs_point_alias = `
precision mediump float;
varying  vec4 color;
 
void
main()
{
    float r = 0.0, delta = 0.0, alpha = 1.0;
    vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
    r = dot(circCoord, circCoord);					// x*x*cos(0) = x2 (= r2 for a circle)
    if (r > 1.0) {
        discard;
    }
    gl_FragColor = color * (alpha);

}`;