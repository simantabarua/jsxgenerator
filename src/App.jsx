import { useState } from "react";
import "./App.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

function App() {
  const [success, setSuccess] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [outputFiles, setOutputFiles] = useState("");
  const [selectedFileType, setSelectedFileType] = useState("");

  const handleSelected = (event) => {
    setSelectedFileType(event.target.value);
  };

  const handleGenerateFile = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fileName = form.fileName.value;
    const trimmedSentence = fileName.trim();
    const files = trimmedSentence.split(" ").map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    const filterDuplicateFileName = [...new Set(files)];

    const outputFileName = filterDuplicateFileName.map((item) => item + "." + selectedFileType);
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
        name: `${file}.${selectedFileType}`,
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
            <h1 className="text-3xl md:text-5xl text-orange-500  mt-2 md:mt-5">
              Bulk JS, JSX, TS, TSX Files{" "}
              <span className="text-green-700">Generator</span>
            </h1>
            <p className="font-bold text-white text-sm md:text-xl my-2 md:my-5">
              Supercharge Your React Workflow <br /> Generate Multiple Files
              with Custom Naming and Download as Zip in Seconds!
            </p>
          </div>
          <form onSubmit={handleGenerateFile}>
            <div className="flex items-center justify-center my-5 flex-col md:flex-row p-5 gap-4 md:gap-0">
              <input
                className="md:w-2/4 p-4 w-full  md:rounded-l-lg font-semibold "
                type="text"
                name="fileName"
                id="text"
                placeholder='Input file names separated by spaces. Example: "home login".'
                onChange={() => {
                  setSuccess(false);
                }}
                required
              />
              <select
                value={selectedFileType}
                onChange={handleSelected}
                required
                className=" px-2  py-[18px]  bg-white border border-gray-400 hover:border-gray-500   focus:outline-none focus:shadow-outline w-full md:w-36"
              >
                <option value="">Select file type</option>
                <option value="js">js</option>
                <option value="jsx">jsx</option>
                <option value="ts">ts</option>
                <option value="tsx">tsx</option>
              </select>

              <button
                type="submit"
                className="w-full md:w-44 text-2xl py-3 px-5  bg-orange-500 text-yellow-100 md:rounded-r-lg hover:bg-orange-600"
              >
                Generate
              </button>
            </div>
          </form>

          {success && (
            <div className="flex items-center justify-center flex-col p-5">
              <p className="font-bold text-white text-sm md:text-xl my-2 md:my-5">
                The following files have been successfully generated:
                <ul className="font-medium list-decimal list-inside md:mt-2">
                  {outputFiles.map((outputFile, index) => (
                    <li key={index}>{outputFile}</li>
                  ))}
                </ul>
              </p>
              <button
                className="my-2 text-2xl py-3 px-8  bg-orange-500 text-yellow-100 rounded-lg  hover:bg-orange-600 animate-bounce"
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
