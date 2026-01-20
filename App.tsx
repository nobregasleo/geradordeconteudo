
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ContentCard from './components/ContentCard';
import { generateMarketingContent } from './services/geminiService';
import { GenerationResponse, ProductContent, ProductID, GOFLUX_PRODUCTS } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'generator' | ProductID>('generator');
  const [theme, setTheme] = useState('');
  const [subthemes, setSubthemes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ProductContent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Product Configs state
  const [productConfigs, setProductConfigs] = useState<Record<string, string>>({});

  // Initialize configs from localStorage or defaults
  useEffect(() => {
    const saved = localStorage.getItem('goflux_product_configs');
    if (saved) {
      setProductConfigs(JSON.parse(saved));
    } else {
      const defaults: Record<string, string> = {};
      GOFLUX_PRODUCTS.forEach(p => {
        defaults[p.id] = p.defaultDescription;
      });
      setProductConfigs(defaults);
    }
  }, []);

  const saveProductConfig = (id: string, description: string) => {
    const newConfigs = { ...productConfigs, [id]: description };
    setProductConfigs(newConfigs);
    localStorage.setItem('goflux_product_configs', JSON.stringify(newConfigs));
  };

  const handleGenerate = async () => {
    if (!theme) {
      setError('Por favor, insira um Tema Central.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await generateMarketingContent(theme, subthemes, productConfigs);
      setResults(response.products);
      setActiveView('generator');
    } catch (err) {
      setError('Falha ao gerar conteúdo. Tente novamente.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderSettingsView = (id: ProductID) => {
    const product = GOFLUX_PRODUCTS.find(p => p.id === id);
    if (!product) return null;

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <i className={`fas ${product.icon} text-2xl text-blue-600`}></i>
            <h2 className="text-3xl font-bold text-slate-900">Configuração: {product.label}</h2>
          </div>
          <p className="text-slate-500">Ajuste o resumo deste produto para personalizar a geração de conteúdo.</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
            Resumo do Produto
          </label>
          <textarea 
            className="w-full h-48 px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700 leading-relaxed mb-6"
            value={productConfigs[id] || ''}
            onChange={(e) => setProductConfigs({ ...productConfigs, [id]: e.target.value })}
            placeholder="Descreva as dores que este produto resolve e seus principais benefícios..."
          />
          
          <div className="flex gap-4">
            <button 
              onClick={() => saveProductConfig(id, productConfigs[id])}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <i className="fas fa-save"></i> Salvar Configuração
            </button>
            <button 
              onClick={() => {
                const newConfigs = { ...productConfigs, [id]: product.defaultDescription };
                setProductConfigs(newConfigs);
              }}
              className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 active:scale-95 transition-all"
            >
              Restaurar Padrão
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
            <i className="fas fa-info-circle text-blue-500 mt-1"></i>
            <p className="text-sm text-blue-800">
              Esta descrição será enviada à IA sempre que você gerar um novo pack de conteúdo, servindo de base para os argumentos de venda de <strong>{product.label}</strong>.
            </p>
          </div>
        </section>
      </div>
    );
  };

  const renderGeneratorView = () => (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Gerador de Conteúdo</h2>
        <p className="text-slate-500">Gere cópias de alta performance baseadas nos seus produtos configurados.</p>
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
              Gerar Pack Estratégico
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
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wider">Pack Disponível</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
            {results.map((product) => (
              <ContentCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {!results && !isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-pen-nib text-3xl opacity-20"></i>
          </div>
          <p className="font-medium text-slate-500">Pronto para começar? Digite um tema acima.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-10">
        {activeView === 'generator' ? renderGeneratorView() : renderSettingsView(activeView as ProductID)}
      </main>
    </div>
  );
};

export default App;
