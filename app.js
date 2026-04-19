import React, { useState } from "react";

function App() {
  const [code, setCode] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [score, setScore] = useState(0);
  const [language, setLanguage] = useState("Unknown");
  const [patterns, setPatterns] = useState([]);

  const reviewCode = async () => {
    if (!code) {
      alert("enter code first")    }

    try {
      const res = await fetch("http://localhost:5000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      console.log("data from backend:",data);

      setSuggestions(data.suggestions || []);
      setScore(data.score || 0);
      setLanguage(data.language || "Unknown");
      setPatterns(data.patterns || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fixCode = async () => {
    if (!code) return;

    try {
      const res = await fetch("http://localhost:5000/fix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      setCode(data.fixedCode || "");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1>⚡ AI Code Reviewer</h1>

      <h3>Language: {language}</h3>

      <textarea
        placeholder="Paste your code..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <div>
        <button onClick={reviewCode}>Review Code</button>
        <button onClick={fixCode}>Fix Code</button>
      </div>

      <h2>Suggestions</h2>
      <ul>
        {suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h2>Score: {score}</h2>

      <h2>Learned Patterns</h2>
      <ul>
        {patterns.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
