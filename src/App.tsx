import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { generateEmbedding, loadEmbeddingModel } from './lib/embeddings';

function App() {
  const [formData, setFormData] = useState({
    prompt: '',
    essay: '',
    source: ''
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'submitting'>('idle');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('essays')
        .select('*', { count: 'exact', head: true });
      
      if (count !== null) setCount(count);
    };
    
    fetchCount();
    // Preload embedding model
    loadEmbeddingModel().catch(err => console.error('Failed to load embedding model:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prompt || !formData.essay) return;

    setStatus('submitting');
    
    try {
      if (!formData.prompt || !formData.essay) {
        throw new Error('Missing required fields');
      }

      console.log('Generating embedding...');
      const embedding = await generateEmbedding(formData.essay);
      console.log('Embedding generated, submitting to Supabase...');

      const { error } = await supabase
        .from('essays')
        .insert([
          { 
            prompt: formData.prompt, 
            content: formData.essay, 
            source: formData.source,
            is_golden: true,
            embedding: embedding
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setStatus('success');
      setCount(c => c + 1);
      setFormData({ prompt: '', essay: '', source: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Submission failed:', err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2 drop-shadow-sm font-sans">
            Voira
            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
              INTERNAL
            </span>
          </h1>
          <p className="text-gray-500 text-sm font-mono mb-6">
            Feed the Orchestrator. Pre-2019 golden samples only.
          </p>

          <div className="mt-8 mb-8">
            <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-2">
              <span>Collection Progress</span>
              <span>{Math.round((count / 2000) * 100)}% ({count.toLocaleString()} / 2,000)</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gray-900 h-1.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${Math.min((count / 2000) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Essay Prompt
            </label>
            <textarea
              id="prompt"
              rows={3}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 font-mono text-sm focus:outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all duration-200 resize-y shadow-inner"
              placeholder="e.g. Write a persuasive essay about the importance of deep work..."
              value={formData.prompt}
              onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="essay" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Golden Essay Content
              </label>
              <span className="text-xs text-gray-400 font-mono">Pre-2019 Only</span>
            </div>
            <textarea
              id="essay"
              rows={12}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 font-mono text-sm focus:outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all duration-200 resize-y shadow-inner"
              placeholder="Paste the high-quality essay content here..."
              value={formData.essay}
              onChange={(e) => setFormData(prev => ({ ...prev, essay: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="source" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Source / Metadata
            </label>
            <input
              type="text"
              id="source"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 font-mono text-sm focus:outline-none focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all duration-200 shadow-inner"
              placeholder="e.g. NYT, 2018 | Paul Graham"
              value={formData.source}
              onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
            />
          </div>

          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full py-4 px-6 rounded-xl text-white font-bold text-lg bg-gray-900 hover:bg-black active:translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center gap-2 group"
          >
            {status === 'submitting' ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Archiving...</span>
              </>
            ) : (
              <>
                <span>Archive Data</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>

        </form>
      </div>

      {status === 'success' && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100]">
          <div className="bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 animate-fade-in min-w-[300px]">
            <div className="rounded-full bg-green-500/20 p-2 mb-1">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold text-lg">Success</span>
            <span className="text-gray-400 text-sm font-mono">Essay archived to database</span>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100]">
          <div className="bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 animate-fade-in min-w-[300px]">
            <div className="rounded-full bg-red-500/20 p-2 mb-1">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="font-bold text-lg">Error</span>
            <span className="text-gray-400 text-sm font-mono">Failed to save data</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
