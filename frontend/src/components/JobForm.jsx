import { useState } from "react";
import axios from "axios";
import ResultCard from "./ResultCard";

export default function JobForm() {
  const [jobText, setJobText] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!jobText || !companyName || !email) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("http://localhost:5000/analyze", {
        jobText,
        companyName,
        email
      });

      setResult(res.data);
    } catch (err) {
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="form-container">

      <textarea
        placeholder="Paste Job Description..."
        rows={6}
        value={jobText}
        onChange={(e) => setJobText(e.target.value)}
      />

      <input
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />

      <input
        type="email"
        placeholder="HR Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "🔍 Analyzing..." : "Analyze Job"}
      </button>

      {result && <ResultCard result={result} />}
    </div>
  );
}