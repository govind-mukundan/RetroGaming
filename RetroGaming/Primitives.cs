using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GlmNet;
using SharpGL;
using SharpGL.VertexBuffers;

namespace RetroGaming
{

    class Point
    {
        VertexBufferArray pointVAO;
        VertexBuffer[] pVBO;
        public vec3[] Pos;
        public float Size;
        public vec4[] Color;

        public void Create(OpenGL GL, GShaderProgram shader, vec3[] vertex, vec4[] color, float size)
        {
            Pos = vertex;
            Color = color;
            Size = size;

            pointVAO = new VertexBufferArray();
            pointVAO.Create(GL);
            pointVAO.Bind(GL);

            pVBO = new VertexBuffer[2];
            pVBO[0] = new VertexBuffer();
            pVBO[0].Create(GL);
            pVBO[1] = new VertexBuffer();
            pVBO[1].Create(GL);
            LoadData(GL, shader, Pos, Color);
            pointVAO.Unbind(GL);
        }

        private void LoadData(OpenGL GL, GShaderProgram shader, vec3[] vertex, vec4[] color){
            
            
            pVBO[0].Bind(GL);
            pVBO[0].SetData(GL, (uint)shader.GetAttributeID(GL, "vPosition"), Pos, false, 3);

            //  Color
            
            pVBO[1].Bind(GL);
            pVBO[1].SetData(GL, (uint)shader.GetAttributeID(GL, "vArgbColor"), Color, false, 4);
        }

        public void Render(OpenGL GL, GShaderProgram shader)
        {
            pointVAO.Bind(GL);
            GL.PointSize(Size);
            // todo: modify to use gl_PointSize = 10.0; in the vertex shader instead
            GL.Enable(OpenGL.GL_POINT_SPRITE_ARB); // MUST be enabled for gl_PointCord to be available in the frag shader
            GL.Enable(OpenGL.GL_POINT_SIZE);
            GL.Enable(OpenGL.GL_BLEND);
            GL.BlendFunc(OpenGL.GL_SRC_ALPHA, OpenGL.GL_ONE_MINUS_SRC_ALPHA);
            LoadData(GL, shader, Pos, Color);

            GL.DrawArrays(OpenGL.GL_POINTS, 0, Pos.Length);
            GL.Disable(OpenGL.GL_POINT_SIZE);
            GL.Disable(OpenGL.GL_POINT_SPRITE_ARB);
            GL.PointSize(1);
            pointVAO.Unbind(GL);
        }

    }

    class Circle
    {

    }

    class Rectangle
    {

    }
}
