
import { useState } from "react";
import api from "../api/axios";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setUploadStatus("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploadStatus("Uploading...");
      const res = await api.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus(`Upload successful: ${res.data.originalname}`);
      setSelectedFile(null);
      e.target.reset(); 
    } catch (error) {
      setUploadStatus("Upload failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Upload File</h2>
      <form onSubmit={handleUpload} encType="multipart/form-data">
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
          className="block w-full mb-4"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Upload
        </button>
      </form>
      {uploadStatus && <p className="mt-2 text-center">{uploadStatus}</p>}
    </div>
  );
}
