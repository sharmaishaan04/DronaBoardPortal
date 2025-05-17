import React, { useState } from "react";

const UploadFileComponent = ({ label, setFile, showNext, index }) => {
  const [fileName, setFileName] = useState("Click here to choose a file");
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB!");
        return;
      }
      setFile((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles[index] = selectedFile;
        return newFiles;
      });

      setFileName(selectedFile.name);
    }
  };

  return (
    <div className="mt-2">
      <div className="text-left text-sm font-medium mb-2">{label}</div>
      <label
        htmlFor={`file-input-${index}`}
        required={true}
        className="border border-gray-300 rounded-md p-2 w-full text-sm mb-4 cursor-pointer bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
      >
        {fileName}
      </label>
      <input
        required={true}
        type="file"
        id={`file-input-${index}`}
        name={label}
        onChange={handleFileChange}
        className="border border-gray-300 rounded-md p-2 w-full text-sm mb-4"
        hidden={true}
      />
    </div>
  );
};

export default UploadFileComponent;
