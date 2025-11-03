import React, { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("connecting...");
  const [json, setJson] = useState(null);

  useEffect(() => {
    fetch("/api/ping")
      .then(r => r.json())
      .then(d => { setJson(d); setStatus("connected"); })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>CloudCollab</h1>
      <p>Backend status: {status}</p>
      <pre style={{ background: "#f4f4f5", padding: 12, borderRadius: 8 }}>
        {JSON.stringify(json, null, 2)}
      </pre>
    </div>
  );
}