import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const mappedFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles(mappedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUploadError("No access token found.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    files.forEach(({ file }) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast.success("Files uploaded successfully!");
        setFiles([]); // Clear previews
        console.log("Upload successful:", result);
      } else {
        const error = await response.json();
        setUploadError(error.detail || "Upload failed");
        toast.error("Upload failed.");
      }
    } catch (err) {
      setUploadError("Something went wrong during the upload.");
      toast.error("Something went wrong during upload.");
      console.error("Error during upload:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Upload Your Files</h2>

      <motion.div
        {...getRootProps()}
        className={`w-full max-w-xl p-10 border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-500">
          {isDragActive
            ? "Drop the files here ..."
            : "Drag & drop files here, or click to select"}
        </p>
      </motion.div>

      {files.length > 0 && (
        <div className="mt-8 w-full max-w-xl space-y-2">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Preview:</h3>
          {files.map(({ file, preview }, idx) => (
            <motion.div
              key={idx}
              className="p-3 bg-white rounded-md shadow flex items-center justify-between"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <span className="truncate text-gray-700 max-w-xs">{file.name}</span>
              {file.type.startsWith("image") && (
                <img
                  src={preview}
                  alt={file.name}
                  className="h-12 w-12 object-cover rounded"
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-lg"
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>

      {uploadError && (
        <div className="mt-4 text-red-500">{uploadError}</div>
      )}
    </motion.div>
  );
}
