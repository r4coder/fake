import { FaExclamationTriangle } from "react-icons/fa";

export default function ResultCard({ result }) {

  // 🎨 Color based on score
  const getColor = (score) => {
    if (score > 60) return "red";      // High Risk
    if (score > 30) return "orange";   // Medium Risk
    return "green";                    // Low Risk
  };

  // 🧠 Risk Level Logic
  const getRiskLabel = (score) => {
    if (score <= 30) return "Low Risk";
    if (score <= 60) return "Medium Risk";
    return "High Risk";
  };

  return (
    <div className="result-card">

      {/* 🎯 Main Statement */}
      <h2 style={{
        color: getColor(result.fraudScore),
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        <FaExclamationTriangle color={getColor(result.fraudScore)} />
        Fraud Score: {result.fraudScore}%
      </h2>

      {/* 🧠 Risk Level */}
      <h3 style={{ color: getColor(result.fraudScore), marginTop: "5px" }}>
        Risk Level: {getRiskLabel(result.fraudScore)}
      </h3>

      {/* 📊 Progress Bar */}
      <div style={{
        height: "10px",
        width: "100%",
        background: "#eee",
        borderRadius: "5px",
        margin: "15px 0"
      }}>
        <div style={{
          height: "100%",
          width: `${result.fraudScore}%`,
          background: getColor(result.fraudScore),
          borderRadius: "5px",
          transition: "width 0.5s ease"
        }} />
      </div>

      {/* 🔥 Reasons */}
      {result.reasons && result.reasons.length > 0 && (
        <div>
          <h4>Reasons:</h4>
          <ul>
            {result.reasons.map((reason, index) => (
              <li key={index}>⚠️ {reason}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔍 Highlighted suspicious text */}
      {result.highlightedText && (
        <div style={{ marginTop: "15px" }}>
          <h4>Highlighted Suspicious Text:</h4>
          <p
            dangerouslySetInnerHTML={{
              __html: result.highlightedText
            }}
          />
        </div>
      )}

    </div>
  );
}