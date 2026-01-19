
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ContentCard from './components/ContentCard';
import { generateMarketingContent } from './services/geminiService';
import { GenerationResponse, ProductContent } from './types';

const App: React.FC = () => {
  const [theme, setTheme] = useState('');
  const [subthemes, setSubthemes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ProductContent[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!theme) {
      setError('Por favor, insira um Tema Central.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await generateMarketingContent(theme, subthemes);
      setResults(response.products);
    } catch (err) {
      setError('Falha ao gerar conteúdo. Verifique sua chave de API ou tente novamente.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Content Engine</h2>
          <p className="text-slate-500">Gere cópias de alta performance para o ecossistema goFlux.</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tema Central</label>
              <input 
                type="text" 
                placeholder="Ex: O Futuro do Frete Rodoviário em 2025"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subtemas (Opcional)</label>
              <input 
                type="text" 
                placeholder="Ex: Sustentabilidade, IA, Fluxo de Caixa..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                value={subthemes}
                onChange={(e) => setSubthemes(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <>
                <i className="fas fa-circle-notch animate-spin"></i>
                Processando Inteligência...
              </>
            ) : (
              <>
                <i className="fas fa-magic"></i>
                Gerar Pack de Conteúdo
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
        </section>

        {results && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Resultados da Geração</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">Pronto</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {results.map((product) => (
                <ContentCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {!results && !isGenerating && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <i className="fas fa-pen-nib text-5xl mb-4 opacity-20"></i>
            <p>Insira um tema para começar a redigir.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
