"use client";
import { useState } from "react";
import { processRLM } from "./actions/rlm";

export default function RLMPage() {
  const [query, setQuery] = useState("");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState("");

  const handleRun = async () => {
    const res = await processRLM(query, context);
    setAnswer(res);
  };

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">RLM Host Interface</h1>
      <textarea 
        placeholder="Paste long context here..." 
        className="w-full h-40 p-2 border rounded"
        onChange={(e) => setContext(e.target.value)}
      />
      <input 
        type="text" 
        className="w-full mt-4 p-2 border rounded" 
        placeholder="Ask a recursive question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
        onClick={handleRun}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
      >
        Execute RLM
      </button>
      {answer && <div className="mt-8 p-4 bg-gray-100 rounded">{answer}</div>}
    </main>
  );
}