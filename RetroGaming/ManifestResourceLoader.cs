using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace RetroGaming
{
    /// <summary>
    /// A small helper class to load manifest resource files.
    /// </summary>
    public static class ManifestResourceLoader
    {
        /// <summary>
        /// Loads the named manifest resource as a text string.
        /// </summary>
        /// <param name="textFileName">Name of the text file.</param>
        /// <returns>The contents of the manifest resource.</returns>
        public static string LoadTextFile(string textFileName)
        {
            var executingAssembly = Assembly.GetExecutingAssembly();
            var pathToDots = textFileName.Replace("\\", ".");
            var location = string.Format("{0}.{1}", executingAssembly.GetName().Name, pathToDots);

            try
            {
                using (var stream = executingAssembly.GetManifestResourceStream(location))
                {
                    using (var reader = new StreamReader(stream))
                    {
                        return reader.ReadToEnd();
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
