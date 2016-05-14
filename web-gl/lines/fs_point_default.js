var fs_point_default = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision mediump float;
varying  vec4 color;
 
void
main()
{
    float alpha = 1.0, width = 0.01, delta = 0.0, alpha2 = 0.0, slope = 0.5; 
#ifdef GL_OES_standard_derivatives
delta = fwidth(gl_PointCoord.y - gl_PointCoord.x);
#endif
    
alpha = smoothstep( -delta, delta, (gl_PointCoord.y + width) - slope*gl_PointCoord.x);
alpha2 = 1.0 - smoothstep( -delta, delta, (gl_PointCoord.y - width) - (slope*gl_PointCoord.x ));
    //alpha = gl_PointCoord.y + smoothstep(gl_PointCoord.y - delta, gl_PointCoord.y + delta gl_PointCoord.y);
    //if(gl_PointCoord.s > (gl_PointCoord.y + width) || (gl_PointCoord.s < (gl_PointCoord.y - width)))
    //  discard;
    
    //gl_FragColor = vec4(color.r, color.g, color.b, (alpha * alpha2));
gl_FragColor = color * (alpha * alpha2);
//gl_FragColor = vec4(color.r * (alpha * alpha2), color.g* (alpha * alpha2), color.b* (alpha * alpha2), color.a);
}`;