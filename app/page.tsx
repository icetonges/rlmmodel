"use client";
import { useState } from "react";
import { processRLM } from "./actions/rlm"; // Make sure this path matches your action file

export default function RLMPage() {
  const [query, setQuery] = useState("");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await processRLM(query, context);
      setAnswer(res);
    } catch (error) {
      console.error(error);
      setAnswer("An error occurred. Check the Vercel logs.");
    }
    setLoading(false);
  };

  return (
    <main className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">Recursive Language Model (RLM) Host</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Environment Context (Massive Text)</label>
          <textarea 
            placeholder="Paste the long context here (this goes to Vercel Blob)..." 
            className="w-full h-40 p-3 border rounded-lg shadow-sm"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Query</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-lg shadow-sm" 
            placeholder="Ask the RLM a question to trigger sub-queries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button 
          onClick={handleRun}
          disabled={loading || !query || !context}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Processing Recursive Calls..." : "Execute RLM"}
        </button>

        {answer && (
          <div className="mt-8 p-6 bg-gray-50 border rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Final Answer:</h2>
            <div className="whitespace-pre-wrap">{answer}</div>
          </div>
        )}
      </div>
    </main>
  );
}