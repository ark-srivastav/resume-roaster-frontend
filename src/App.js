import { useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

const handleFile = (f) => {
  if (!f || f.type !== "application/pdf") {
    alert("Sirf PDF chalega bhai! 😂");
    return;
  }
  if (f.size > 2 * 1024 * 1024) {
    alert("Bhai 2MB se bada resume?! Itna bada CV hai toh novel likh de! 📚");
    return;
  }
  setFile(f);
};


  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const submitResume = async () => {
    if (!file) return;
    setLoading(true);
    setRoast("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(`${process.env.REACT_APP_ROASTER_BACKEND_API_URL}/roast`, formData);

      setRoast(res.data.roast);
    } catch (err) {
      setRoast("Kuch toh gadbad hai bhai 😭");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🔥 Resume Roaster</h1>
      <p className="subtitle">Upload karo, judgement pao. Free of cost, full desi.</p>

      <div
        className={`dropzone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {file ? `✅ ${file.name}` : "📄 Drop your resume here or click to upload"}
        <input
          id="fileInput"
          type="file"
          accept=".pdf"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
      <p className="size-hint">PDF only · Max 2MB · Resumes only please 🙏</p>

      <button onClick={submitResume} disabled={!file || loading}>
        {loading ? "Roasting... 🔥" : "Roast My Resume 🌶️"}
      </button>

      {roast && (
        <div className="roast-output">
          <pre>{roast}</pre>
        </div>
      )}
    </div>
  );
}