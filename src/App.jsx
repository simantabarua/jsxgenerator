import { useState } from "react";
import "./App.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

function App() {
  const [success, setSuccess] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [outputFiles, setOutputFiles] = useState("");

  const handleGenerateFile = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fileName = form.fileName.value;
    const trimmedSentence = fileName.trim();
    const files = trimmedSentence.split(" ").map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    const filterDuplicateFileName = [...new Set(files)];

    const outputFileName = filterDuplicateFileName.map((item) => item + ".jsx");
    setOutputFiles(outputFileName);

    let generatedFiles = [];

    for (const file of filterDuplicateFileName) {
      // Generate the JavaScript code
      const code = `
        const ${file} = () => {
          return (
            <div>${file}</div>
          )
        }

        export default ${file};
      `;
      const generatedFile = {
        name: `${file}.jsx`,
        url: code,
      };
      generatedFiles.push(generatedFile);
    }
    setGeneratedFiles(generatedFiles);
    setSuccess(true);

    Swal.fire({
      icon: "success",
      title: "Your jsx file has been created successfully",
      showConfirmButton: false,
      timer: 1000,
    });
    form.reset();
  };

  const handleDownload = () => {
    const zip = new JSZip();
    generatedFiles.forEach((file) => {
      zip.file(file.name, file.url);
    });
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "generated_files.zip");
    });
  };

  return (
    <>
      <main>
        <div className="my-28">
          <div className="text-center">
            <h1 className="text-7xl text-orange-500  mt-5">
              Bulk JSX Files <span className="text-green-700">Generator</span>
            </h1>
            <p className="font-bold text-white text-xl my-5">
              Supercharge Your React Workflow - Generate Multiple JSX Files with
              Custom Naming and Download as Zip in Seconds!
            </p>
          </div>
          <form onSubmit={handleGenerateFile}>
            <div className="flex items-center justify-center my-5">
              <input
                className="w-2/4 p-4 rounded-l-lg font-semibold "
                type="text"
                name="fileName"
                id="text"
                placeholder='Input file names separated by spaces. Example: "home login".'
                onChange={() => {
                  setSuccess(false);
                }}
                required
              />

              <button
                type="submit"
                className="text-2xl py-3 px-5  bg-orange-500 text-yellow-100 rounded-r-lg hover:bg-orange-600"
              >
                Generate
              </button>
            </div>
          </form>

          {success && (
            <div className="flex items-center justify-center flex-col">
              <p className="font-bold text-white text-xl my-5">
                The following files have been successfully generated:
                <ul className="font-medium list-decimal list-inside mt-2">
                  {outputFiles.map((outputFile, index) => (
                    <li key={index}>{outputFile}</li>
                  ))}
                </ul>
              </p>
              <button
                className="ext-2xl py-3 px-8  bg-orange-500 text-yellow-100 rounded-lg  hover:bg-orange-600 animate-bounce"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
