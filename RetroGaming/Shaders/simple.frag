#version 330
 
in vec4 color;
out vec4 outputColor;
 
void
main()
{
  float r = 0, delta = 0, alpha = 0;
  
vec2 circCoord = 2.0 * gl_PointCoord - 1.0;		// Dont forget to enable GL_POINT_SPRITE_ARB to access gl_PointCoord
//if (dot(circCoord, circCoord) < 1.0) {
//if (dot(circCoord, circCoord) > 1.0) {
//if (gl_PointCoord.t < 0.5) {
//float cood = smoothstep(0,1,dot(circCoord, circCoord));
r = dot(circCoord, circCoord);					// x*x*cos(0) = x2 (= r2 for a circle)
delta = fwidth(r);								// This returns the derivative of r variable at this pixel
alpha = 1 - smoothstep(1 - delta, 1, r);		// For pixels with radius in the range 1-delta to 1, interpolate between [1-delta,1]. If x < min, op = 0, if x > max, op = 1
gl_FragColor = color * (alpha);

}