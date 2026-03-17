"use client";

import React, { useState } from 'react';
import { Loader2, Sparkles, Download, RefreshCcw } from 'lucide-react';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState('');

  const generateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt,
          modelId: "rudalle-Malevich",
          apiKey: "unlimited-malevich-key-0000"
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Generation failed');

      setHistory([{ 
        prompt, 
        url: data.images[0].url, 
        id: Date.now() 
      }, ...history]);
      setPrompt('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
      <form onSubmit={generateImage} className="glass-panel p-6 rounded-2xl shadow-2xl">
        <div className="flex flex-col gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none h-32 resize-none"
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-zinc-500">Model: rudalle-Malevich • Free Unlimited Usage</p>
            <button
              disabled={loading || !prompt}
              className="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-900/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? 'Thinking...' : 'Generate'}
            </button>
          </div>
        </div>
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {history.map((item) => (
          <div key={item.id} className="glass-panel rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <img src={item.url} alt={item.prompt} className="w-full aspect-square object-cover" />
            <div className="p-4">
              <p className="text-sm text-zinc-300 line-clamp-2 italic mb-3">"{item.prompt}"</p>
              <div className="flex gap-2">
                <a
                  href={item.url}
                  download
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Download size={14} /> Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {history.length === 0 && !loading && (
        <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl">
           <RefreshCcw className="mx-auto text-zinc-700 mb-4" size={48} />
           <p className="text-zinc-500 font-medium">Your creations will appear here.</p>
        </div>
      )}
    </div>
  );
}