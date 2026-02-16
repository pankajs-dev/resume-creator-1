import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [empId, setEmpId] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !empId) {
      setMessage("Please select a file and enter employee ID");
      return;
    }

    const formData = new FormData();
    formData.append("emp_id", empId.toString()); // number to string
    formData.append("document", file); // must match ORDS_UTIL.GET_FILE('document')

    try {
      const response = await axios.post(
        "http://localhost:8080/ords/demo123/staffapi/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setMessage(response.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed!");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2 className="text-dark">Upload File</h2>
      <input
        type="number"
        placeholder="Employee ID"
        value={empId}
        onChange={(e) => setEmpId(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: "10px" }}
        className="text-dark"
      />
      <br />
      <button
        onClick={handleUpload}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Upload
      </button>
      {message && (
        <p className="text-dark" style={{ marginTop: "15px" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
