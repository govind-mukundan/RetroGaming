var fs_point_alias = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision mediump float;
varying  vec4 color;
 
void main()
{
    float r = 0.0, delta = 0.0, alpha = 1.0;
    vec2 circCoord = 2.0 * gl_PointCoord - 1.0;
    r = dot(circCoord, circCoord);					    // x*x*cos(0) = x2 (= r2 for a circle)
#ifdef GL_OES_standard_derivatives
    delta = fwidth(r);								    // This returns the derivative of r variable at this pixel
    alpha = 1.0 - smoothstep(1.0 - delta, 1.0, r);		// For pixels with radius in the range 1-delta to 1, interpolate between [1-delta,1]. If x < min, op = 0, if x > max, op = 1
#endif
gl_FragColor = color * vec4(1.0,1.0,1.0,alpha);
}`;