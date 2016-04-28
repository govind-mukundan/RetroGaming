#version 330
 
in vec4 color;
out vec4 outputColor;
uniform float vRadius;
uniform vec3 center;
 
void
main()
{
  float r = 0, delta = 0, alpha = 0;
  

//vec2 circCoord = 2.0 * gl_PointCoord - 1.0;		// Dont forget to enable GL_POINT_SPRITE_ARB to access gl_PointCoord
//r = dot(circCoord, circCoord);					// x*x*cos(0) = x2 (= r2 for a circle)

r = distance(vec2(gl_FragCoord.x/gl_FragCoord.w, gl_FragCoord.y/gl_FragCoord.w), vec2(0,0));

//if(r < .2 ) discard;

delta = fwidth(r);								// This returns the derivative of r variable at this pixel
alpha = smoothstep(.5 - delta, .5, r);		// For pixels with radius in the range 1-delta to 1, interpolate between [0,1]. If x < min, op = 0, if x > max, op = 1
gl_FragColor = color * (alpha);

}