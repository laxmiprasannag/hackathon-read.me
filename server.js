const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🧠 Memory (simple)
let learnedPatterns = [];

// ✅ TEST
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ==========================
// 🔥 REVIEW API
// ==========================

app.post("/review", (req, res) => {
  const { code } = req.body;

  let suggestions = [];
  let score = 100;
  let language = "Unknown";

  // 🧠 BETTER LANGUAGE DETECTION
  if (code.includes("console.log") || code.includes("=>") || code.includes("let ") || code.includes("var ")) {
    language = "JavaScript";
  } 
  else if (code.includes("print(") || code.includes("def ") || code.includes(":")) {
    language = "Python";
  } 
  else if (code.includes("#include") && code.includes("cout")) {
    language = "C++";
  } 
  else if (code.includes("#include")) {
    language = "C";
  } 
  else if (code.includes("public class") || code.includes("System.out")) {
    language = "Java";
  }

  // =====================
  // 🔥 RULES
  // =====================

  // JS
  if (language === "JavaScript") {
    if (code.includes("var")) {
      suggestions.push("Use let/const instead of var");
      score -= 10;
    }
    if (code.includes("console.log")) {
      suggestions.push("Remove console.log in production");
      score -= 5;
    }
  }

  // Python
  if (language === "Python") {
    if (code.includes(";")) {
      suggestions.push("Python does not need semicolons");
      score -= 5;
    }
    if (!code.includes(":") && code.match(/\b(if|for|while)\b/)) {
      suggestions.push("Missing ':' in control statements");
      score -= 10;
    }
  }

  // C / C++
  if (language === "C" || language === "C++") {
    if (!code.includes(";")) {
      suggestions.push("Missing semicolons");
      score -= 10;
    }
    if (!code.includes("return")) {
      suggestions.push("Missing return statement");
      score -= 10;
    }
  }

  // Java
  if (language === "Java") {
    if (!code.includes("main")) {
      suggestions.push("Missing main method");
      score -= 15;
    }
  }

  // =====================
  // 🛡️ FALLBACK (IMPORTANT)
  // =====================

  if (suggestions.length === 0) {
    suggestions.push("✅ Code looks clean. No major issues found.");
  }

  if (code.trim().length < 10) {
    suggestions.push("Code might be too short or incomplete");
    score -= 5;
  }

  if (score < 0) score = 0;

  res.json({
    suggestions,
    score,
    language,
    patterns: [] // keep this for frontend
  });
});



// ==========================
// 🔥 FIX API
// ==========================
app.post("/fix", (req, res) => {
  let { code } = req.body;

  if (!code) {
    return res.json({ fixedCode: "" });
  }

  code = code.replace(/\bvar\b/g, "let");
  code = code.replace(/console\.log\(.*?\);?/g, "");
  code = code.trim();

  let open = (code.match(/{/g) || []).length;
  let close = (code.match(/}/g) || []).length;

  while (close < open) {
    code += "\n}";
    close++;
  }

  res.json({ fixedCode: code });
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
