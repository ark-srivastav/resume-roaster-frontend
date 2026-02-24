import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./App.css";

const QUOTES = [
  { text: "Adventure is out there!", movie: "Up (2009)" },
  { text: "Just keep swimming.", movie: "Finding Nemo (2003)" },
  { text: "To infinity and beyond!", movie: "Toy Story (1995)" },
  { text: "The flower that blooms in adversity is the most rare and beautiful of all.", movie: "Mulan (1998)" },
  { text: "Ohana means family. Family means nobody gets left behind.", movie: "Lilo & Stitch (2002)" },
  { text: "Even miracles take a little time.", movie: "Cinderella (1950)" },
  { text: "The past can hurt. But the way I see it, you can either run from it or learn from it.", movie: "The Lion King (1994)" },
  { text: "You are a toy!", movie: "Toy Story (1995)" },
  { text: "If you focus on what you left behind, you will never be able to see what lies ahead.", movie: "Ratatouille (2007)" },
  { text: "Change is nature, Dad. The part that we can influence. And it starts when we decide.", movie: "Ratatouille (2007)" },
  { text: "Life is not a spectator sport.", movie: "The Hunchback of Notre Dame (1996)" },
  { text: "I'm fast. Faster than fast, quicker than quick. I am Lightning!", movie: "Cars (2006)" },
  { text: "Ka-chow!", movie: "Cars (2006)" },
  { text: "First rule of leadership: everything is your fault.", movie: "A Bug's Life (1998)" },
  { text: "The only thing predictable about life is its unpredictability.", movie: "Ratatouille (2007)" },
  { text: "You must not let anyone define your limits because of where you come from.", movie: "Ratatouille (2007)" },
  { text: "Sometimes the right path is not the easiest one.", movie: "Pocahontas (1995)" },
  { text: "Our fate lives within us. You only have to be brave enough to see it.", movie: "Brave (2012)" },
  { text: "Giving up is for rookies.", movie: "Hercules (1997)" },
  { text: "All it takes is faith and trust.", movie: "Peter Pan (1953)" },
];

function QuoteLoader() {
  const [index, setIndex] = useState(Math.floor(Math.random() * QUOTES.length));
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % QUOTES.length);
        setFade(true);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="quote-loader">
      <div className="spinner">
        <div className="spinner-ring" />
        <div className="spinner-ring ring2" />
        <div className="spinner-ring ring3" />
      </div>
      <div className={`quote-text ${fade ? "fade-in" : "fade-out"}`}>
        <p className="quote">"{QUOTES[index].text}"</p>
        <p className="quote-movie">— {QUOTES[index].movie}</p>
      </div>
      <p className="roasting-label">Roasting your resume... 🔥</p>
    </div>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const roastRef = useRef(null);

  useEffect(() => {
    if (roast && roastRef.current) {
      roastRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [roast]);

  const handleFile = (f) => {
    setError("");
    if (!f || f.type !== "application/pdf") {
      setError("Sirf PDF chalega bhai! Please upload a PDF file.");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setError("File is too large! Max 2MB. Itna bada resume?! 😂");
      return;
    }
    setFile(f);
    setRoast("");
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
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_ROASTER_BACKEND_API_URL}/roast`,
        formData
      );
      setRoast(res.data.roast);
    } catch (err) {
      setError("Something went wrong. Kuch toh gadbad hai bhai 😭 Try again!");
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <div className="bg-orbs">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      <div className="container">
        <header className="header">
          <div className="logo">🔥</div>
          <h1>Resume Roaster</h1>
          <p className="tagline">
            Upload your resume. Get roasted. Desi style. <span className="tag">Free</span>
          </p>
        </header>

        <div className="card upload-card">
          <div
            className={`dropzone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              hidden
              onChange={(e) => handleFile(e.target.files[0])}
            />
            {file ? (
              <div className="file-info">
                <span className="file-icon">📄</span>
                <div>
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024).toFixed(1)} KB · Ready to roast</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setRoast(""); }}
                >✕</button>
              </div>
            ) : (
              <div className="drop-prompt">
                <div className="drop-icon">📂</div>
                <p className="drop-title">Drop your resume here</p>
                <p className="drop-sub">or click to browse · PDF only · Max 2MB</p>
              </div>
            )}
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button
            className="roast-btn"
            onClick={submitResume}
            disabled={!file || loading}
          >
            {loading ? "Roasting..." : "🌶️ Roast My Resume"}
          </button>
        </div>

        {loading && <QuoteLoader />}

        {roast && !loading && (
          <div className="card roast-card" ref={roastRef}>
            <div className="roast-header">
              <span className="roast-title">🔥 Your Roast</span>
              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(roast)}
              >Copy</button>
            </div>
            <div className="roast-content">
              <ReactMarkdown>{roast}</ReactMarkdown>
            </div>
          </div>
        )}

        <footer className="footer">
          <p>Built with 💜 by <a href="https://ark-srivastav.net" target="_blank" rel="noreferrer">Ark Srivastav</a></p>
        </footer>
      </div>
    </div>
  );
}