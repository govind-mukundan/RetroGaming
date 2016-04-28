using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using SharpGL.SceneGraph;
using SharpGL;
using GovsGold.Utils;
using System.Diagnostics;
using GlmNet;

namespace RetroGaming
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        bool _debug = true;

        double cWidth;
        double cHeight;
        //  The shader program for our vertex and fragment shader.
        GShaderProgram textureShader;
        GShaderProgram colorShader;
        GShaderProgram simpleShader;
        string[] vertexShaderSource;
        string[] fragmentShaderSource;
        string[] geomShaderSource;

        // Matrices
        int C_SCENE_DYNAMIC_ELEMENT_COUNT = 2;
        mat4[] ModelMatrix;
        mat4[] ViewMatrix;

        // Objects
        Compass _compass;
        Point[] _p;

        const int POINT_TYPES = 30; // Lets have 30 different sizes
        const int POINTS = 30; // Lets have 30 points of a size
        const int POINT_DEFAULT_SIZE = 100;


        // Random number
        Random rand;
        /// <summary>
        /// Initializes a new instance of the <see cref="MainWindow"/> class.
        /// </summary>
        public MainWindow()
        {
            InitializeComponent();

            vertexShaderSource = new string[2];
            fragmentShaderSource = new string[2];
            geomShaderSource = new string[2];

            ModelMatrix = new mat4[C_SCENE_DYNAMIC_ELEMENT_COUNT];
            ViewMatrix = new mat4[C_SCENE_DYNAMIC_ELEMENT_COUNT];

            rand = new Random(123);
            _p = new Point[POINT_TYPES];

        }


        int random(int n)
        {
            int p = rand.Next();
            return (p * n) >> 16;
        }

        // NextDouble ranges from 0 to 1, we shift it to -1 to 1
        float rf()
        {
            return (2f * (float)rand.NextDouble() - 1f);
        }


        int count;
        /// <summary>
        /// Handles the OpenGLDraw event of the openGLControl1 control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="args">The <see cref="SharpGL.SceneGraph.OpenGLEventArgs"/> instance containing the event data.</param>
        private void openGLControl_OpenGLDraw(object sender, OpenGLEventArgs args)
        {
            //  Get the OpenGL object.
            OpenGL gl = openGLControl.OpenGL;
            gl.Clear(OpenGL.GL_COLOR_BUFFER_BIT | OpenGL.GL_DEPTH_BUFFER_BIT | OpenGL.GL_STENCIL_BUFFER_BIT);
            //gl.ClearColor(0.4f, 0.6f, 0.9f, 0.0f);
            RenderFizzDemo(gl);





        }

        void RenderFizzDemo(OpenGL gl)
        {
            for (int j = 0; j < POINT_TYPES; j++)
            {
                _p[j].Size = (float)rand.NextDouble() * POINT_DEFAULT_SIZE;
                for (int i = 0; i < POINTS; i++)
                {
                    _p[j].Pos[i].x = rf(); _p[j].Pos[i].y = rf(); _p[j].Pos[i].z = 1; // No 3D!!
                    _p[j].Color[i].x = rf(); _p[j].Color[i].y = rf(); _p[j].Color[i].z = rf(); _p[j].Color[i].w = rf();
                }
            }


            simpleShader.Bind(gl);
            for (int j = 0; j < POINT_TYPES; j++)
                _p[j].Render(gl, simpleShader);
            simpleShader.Unbind(gl);
        }

        /// <summary>
        /// Handles the OpenGLInitialized event of the openGLControl1 control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="args">The <see cref="SharpGL.SceneGraph.OpenGLEventArgs"/> instance containing the event data.</param>
        private void openGLControl_OpenGLInitialized(object sender, OpenGLEventArgs args)
        {
            //  TODO: Initialise OpenGL here.

            //  Get the OpenGL object.
            OpenGL gl = openGLControl.OpenGL;

            //  Set the clear color.
            gl.ClearColor(0, 0, 0, 0);

            cWidth = openGLControl.ActualWidth;
            cHeight = openGLControl.ActualHeight;
            Debug.WriteIf(_debug, "Width = " + cWidth.ToString() + " Height = " + cHeight.ToString());

            simpleShader = new GShaderProgram();
            vertexShaderSource[0] = ManifestResourceLoader.LoadTextFile("Shaders\\simple.vert");
            fragmentShaderSource[0] = ManifestResourceLoader.LoadTextFile("Shaders\\simple.frag");
            //vertexShaderSource[0] = ManifestResourceLoader.LoadTextFile("Shaders\\circle.vert");
            //fragmentShaderSource[0] = ManifestResourceLoader.LoadTextFile("Shaders\\circle.frag");
            simpleShader.Create(gl, vertexShaderSource[0], fragmentShaderSource[0], null);
            simpleShader.AssertValid(gl);

            textureShader = new GShaderProgram();
            vertexShaderSource[1] = ManifestResourceLoader.LoadTextFile("Shaders\\texture.vert");
            fragmentShaderSource[1] = ManifestResourceLoader.LoadTextFile("Shaders\\texture.frag");
            textureShader.Create(gl, vertexShaderSource[1], fragmentShaderSource[1], null);
            textureShader.AssertValid(gl);

            _compass = new Compass();
            _compass.Create(gl, "", textureShader); // AppDomain.CurrentDomain.BaseDirectory + "textures\\compass-dial.png"

            // Allocate memory for all the points
            for (int i = 0; i < POINT_TYPES; i++)
            {
                vec3[] v = new vec3[POINTS];
                vec4[] c = new vec4[POINTS];
                for (int j = 0; j < POINTS; j++)
                {
                    v[i] = new vec3(0, 0, 0);
                    c[i] = new vec4(0, 0, 0, 0);
                }
                _p[i] = new Point();
                _p[i].Create(gl, simpleShader, v, c, 0);
            }
        }

        /// <summary>
        /// Handles the Resized event of the openGLControl1 control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="args">The <see cref="SharpGL.SceneGraph.OpenGLEventArgs"/> instance containing the event data.</param>
        private void openGLControl_Resized(object sender, OpenGLEventArgs args)
        {
            //  TODO: Set the projection matrix here.

            cWidth = openGLControl.ActualWidth;
            cHeight = openGLControl.ActualHeight;
            Debug.WriteIf(_debug, "Width = " + cWidth.ToString() + " Height = " + cHeight.ToString());
        }

        /// <summary>
        /// The current rotation.
        /// </summary>
        private float rotation = 0.0f;

        void DrawCompass(OpenGL GL)
        {
            mat4 model = mat4.identity();
            model = glm.translate(model, new vec3(7, -3, -6));
            //model = glm.scale(model,new vec3(0.2f));
            textureShader.Bind(GL);
            textureShader.SetUniform(GL, "projectionMatrix", glm.perspective(myGLM.D2R(60), (float)cWidth / (float)cHeight, 0.01f, 100.0f));
            textureShader.SetUniform(GL, "viewMatrix", mat4.identity()); // glm.lookAt(new vec3(0f, 0f, -6f), new vec3(0f, 0f, 0f), new vec3(0.0f, 1.0f, 0.0f))
            textureShader.SetUniform(GL, "modelMatrix", model);
            textureShader.SetUniform(GL, "normalMatrix", myGLM.transpose(glm.inverse(model)));

            //textureShader.SetUniform(GL, "sunLight.vColor", new vec3(1f, 1f, 1f));
            //textureShader.SetUniform(GL, "sunLight.Ka", new vec3(.1f, .1f, .1f));
            //textureShader.SetUniform(GL, "sunLight.Kd", new vec3(1f, 1f, 1f));
            //textureShader.SetUniform(GL, "sunLight.vDirection", new vec3(0f, 0f, 1f));
            //textureShader.SetUniform(GL, "specLight.vDirection", new vec3(0f, 0f, 0f));
            //textureShader.SetUniform(GL, "specLight.Ks", new vec3(.9f, .9f, .9f));
            //textureShader.SetUniform(GL, "specLight.Shininess", 100f);

            _compass.Render(GL, textureShader);

            //model = mat4.identity();
            //model = glm.translate(model, new vec3(7, -3, -6));
            //model = glm.rotate(model, D2R(-1 * _compassRot), new vec3(0f, 0f, 1f));
            //model = glm.scale(model, new vec3(.1f, .8f, 1f));

            //textureShader.SetUniform(GL, "projectionMatrix", glm.perspective(D2R(60), (float)cWidth / (float)cHeight, 0.01f, 100.0f));
            //textureShader.SetUniform(GL, "viewMatrix", mat4.identity()); // glm.lookAt(new vec3(0f, 0f, -6f), new vec3(0f, 0f, 0f), new vec3(0.0f, 1.0f, 0.0f))
            //textureShader.SetUniform(GL, "modelMatrix", model);
            //textureShader.SetUniform(GL, "normalMatrix", myGLM.transpose(glm.inverse(model)));
            //_cArrow.Render(GL, textureShader);

            textureShader.Unbind(GL);

        }
    }
}
