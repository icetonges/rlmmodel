"use client";
import { useState } from "react";
import { processRLM } from "./actions/rlm";

export default function RLMPage() {
  const [query, setQuery] = useState("");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!query || !context) return;
    
    setLoading(true);
    setAnswer(""); // Clear previous answer
    try {
      const res = await processRLM(query, context);
      setAnswer(res);
    } catch (error) {
      console.error(error);
      setAnswer("An error occurred. Please check your API keys and Vercel Blob configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-4xl mx-auto bg-black text-white min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-6">Recursive Language Model (RLM) Host</h1>
      
      <div className="space-y-6">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Environment Context (Large Data)
          </label>
          <textarea 
            placeholder="Paste your massive text context here..."
            className="w-full h-48 p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-400">
            Query / Goal
          </label>
          <input 
            type="text"
            placeholder="What should the model find or build?"
            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button 
          onClick={handleRun}
          disabled={loading || !query || !context}
          className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 disabled:bg-zinc-700 disabled:text-zinc-500 transition-all shadow-lg"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-pulse">●</span> Executing Recursive Calls...
            </span>
          ) : (
            "Execute RLM"
          )}
        </button>

        {/* Output Box */}
        {answer && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
              <h2 className="text-sm uppercase tracking-widest font-bold mb-4 text-blue-500">
                Strategy Output
              </h2>
              <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                {answer}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}