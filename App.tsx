

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ContentCard from './components/ContentCard';
import { generateMarketingContent } from './services/geminiService';
import { GenerationResponse, ProductContent, ProductID, GOFLUX_PRODUCTS, ChannelID, GOFLUX_CHANNELS, Persona, ProductConfigData } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'generator' | ProductID | ChannelID>('generator');
  const [theme, setTheme] = useState('');
  const [subthemes, setSubthemes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<ProductContent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Product Configs state - Initialized using a function to load from localStorage or defaults
  // This ensures the state always starts with a valid Record<ProductID, ProductConfigData>
  const [productConfigs, setProductConfigs] = useState<Record<ProductID, ProductConfigData>>(() => {
    const savedProductConfigs = localStorage.getItem('goflux_product_configs');
    if (savedProductConfigs) {
      const parsedConfigs: Record<ProductID, Partial<ProductConfigData>> = JSON.parse(savedProductConfigs); 
      
      const fullConfigs = GOFLUX_PRODUCTS.reduce((acc, p) => {
        const saved = parsedConfigs[p.id];
        acc[p.id] = {
          generalDescription: saved?.generalDescription || p.defaultGeneralDescription,
          personaDescriptions: {
            [Persona.EMBARCADOR]: saved?.personaDescriptions?.[Persona.EMBARCADOR] || p.defaultPersonaDescriptions[Persona.EMBARCADOR],
            [Persona.TRANSPORTADOR]: saved?.personaDescriptions?.[Persona.TRANSPORTADOR] || p.defaultPersonaDescriptions[Persona.TRANSPORTADOR],
          },
        };
        return acc;
      }, {} as Record<ProductID, ProductConfigData>);
      return fullConfigs;
    } else {
      // Initialize defaults if nothing is in localStorage
      const defaults: Record<ProductID, ProductConfigData> = GOFLUX_PRODUCTS.reduce((acc, p) => {
        acc[p.id] = {
          generalDescription: p.defaultGeneralDescription,
          personaDescriptions: p.defaultPersonaDescriptions,
        };
        return acc;
      }, {} as Record<ProductID, ProductConfigData>);
      return defaults;
    }
  });

  // Channel Configs state - Initialized using a function to load from localStorage or defaults
  const [channelConfigs, setChannelConfigs] = useState<Record<string, string>>(() => {
    const savedChannelConfigs = localStorage.getItem('goflux_channel_configs');
    if (savedChannelConfigs) {
      return JSON.parse(savedChannelConfigs);
    } else {
      const defaults: Record<string, string> = {};
      GOFLUX_CHANNELS.forEach(c => {
        defaults[c.id] = c.defaultPrompt;
      });
      return defaults;
    }
  });

  // Filter states
  const [selectedProductFilters, setSelectedProductFilters] = useState<ProductID[] | 'all'>('all');
  const [selectedChannelFilters, setSelectedChannelFilters] = useState<ChannelID[] | 'all'>('all');
  const [selectedPersonaFilter, setSelectedPersonaFilter] = useState<Persona | 'none'>('none');

  // New state for modification instruction
  const [modificationInstruction, setModificationInstruction] = useState('');

  // Effect to save productConfigs to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('goflux_product_configs', JSON.stringify(productConfigs));
  }, [productConfigs]);

  // Effect to save channelConfigs to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('goflux_channel_configs', JSON.stringify(channelConfigs));
  }, [channelConfigs]);

  // The saveProductConfig and saveChannelConfig functions are no longer needed
  // as the useEffect hooks handle saving automatically on state changes.
  // The setter functions (setProductConfigs, setChannelConfigs) are used directly.

  const handleGenerateContent = async (instructionToApply?: string) => { // Modified function to accept an optional instruction
    if (!theme) {
      setError('Por favor, insira um Tema Central.');
      return;
    }
    if (selectedProductFilters !== 'all' && selectedProductFilters.length === 0) { 
      setError('Selecione ao menos um produto para gerar conteúdo.');
      return;
    }
    if (selectedChannelFilters !== 'all' && selectedChannelFilters.length === 0) { 
      setError('Selecione ao menos um canal para gerar conteúdo.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    if (!instructionToApply) { // Only clear results entirely if it's a fresh generation
      setResults(null); 
      setModificationInstruction(''); // Clear modification instruction on fresh generation
    }
    
    try {
      const response = await generateMarketingContent(
        theme, 
        subthemes, 
        productConfigs, 
        channelConfigs,
        selectedProductFilters, 
        selectedChannelFilters,
        selectedPersonaFilter,
        instructionToApply // Pass the modification instruction
      );
      setResults(response.products);
      if (instructionToApply) {
        setModificationInstruction(''); // Clear the instruction after applying it
      }
      // setActiveView('generator'); // Stay on generator view, no explicit navigation needed
    } catch (err) {
      console.error(err);
      setError(`Falha ao gerar conteúdo: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Filter Logic ---
  const isProductSelected = (id: ProductID) => selectedProductFilters === 'all' || selectedProductFilters.includes(id);
  const toggleProductFilter = (id: ProductID) => {
    if (selectedProductFilters === 'all') {
      const newSelection = GOFLUX_PRODUCTS.map(p => p.id).filter(pid => pid !== id);
      setSelectedProductFilters(newSelection.length === GOFLUX_PRODUCTS.length ? 'all' : newSelection);
    } else {
      if (selectedProductFilters.includes(id)) {
        const newSelection = selectedProductFilters.filter(pid => pid !== id);
        setSelectedProductFilters(newSelection);
      } else {
        const newSelection = [...selectedProductFilters, id];
        setSelectedProductFilters(newSelection.length === GOFLUX_PRODUCTS.length ? 'all' : newSelection);
      }
    }
  };
  const selectAllProducts = () => setSelectedProductFilters('all');
  const deselectAllProducts = () => setSelectedProductFilters([]);

  const isChannelSelected = (id: ChannelID) => selectedChannelFilters === 'all' || selectedChannelFilters.includes(id);
  const toggleChannelFilter = (id: ChannelID) => {
    if (selectedChannelFilters === 'all') {
      const newSelection = GOFLUX_CHANNELS.map(c => c.id).filter(cid => cid !== id);
      setSelectedChannelFilters(newSelection.length === GOFLUX_CHANNELS.length ? 'all' : newSelection);
    } else {
      if (selectedChannelFilters.includes(id)) {
        const newSelection = selectedChannelFilters.filter(cid => cid !== id);
        setSelectedChannelFilters(newSelection);
      } else {
        const newSelection = [...selectedChannelFilters, id];
        setSelectedChannelFilters(newSelection.length === GOFLUX_CHANNELS.length ? 'all' : newSelection);
      }
    }
  };
  const selectAllChannels = () => setSelectedChannelFilters('all');
  const deselectAllChannels = () => setSelectedChannelFilters([]);

  const isPersonaSelected = (persona: Persona | 'none') => selectedPersonaFilter === persona;
  const setPersonaFilter = (persona: Persona | 'none') => setSelectedPersonaFilter(persona);
  // --- End Filter Logic ---


  const renderGeneratorView = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Gerador de Conteúdo goFlow</h2>
        <p className="text-slate-500">
          Insira um tema central e subtemas para gerar conteúdo de marketing personalizado para seus produtos e canais.
        </p>
      </header>

      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="theme" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Tema Central <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="theme"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700"
              placeholder="Ex: ESG na Logística, O Futuro do Transporte"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <div>
            <label htmlFor="subthemes" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Subtemas (opcional)
            </label>
            <input
              type="text"
              id="subthemes"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700"
              placeholder="Ex: Redução de custos, eficiência operacional"
              value={subthemes}
              onChange={(e) => setSubthemes(e.target.value)}
              disabled={isGenerating}
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Otimizar Geração</h3>
          <p className="text-slate-500 text-sm mb-6">Selecione os produtos, canais e persona para os quais deseja gerar conteúdo.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Product Filters */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Filtrar Produtos</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={selectAllProducts}
                    className={`px-4 py-2 text-xs font-medium rounded-full transition-all ${selectedProductFilters === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={deselectAllProducts}
                    className="px-4 py-2 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    Nenhum
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                {GOFLUX_PRODUCTS.map(product => (
                  <button
                    key={product.id}
                    onClick={() => toggleProductFilter(product.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isProductSelected(product.id)
                        ? `${product.bgColorClass} ${product.colorClass} border border-transparent`
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <i className={`fas ${product.icon}`}></i>
                    {product.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Channel Filters */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Filtrar Canais</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={selectAllChannels}
                    className={`px-4 py-2 text-xs font-medium rounded-full transition-all ${selectedChannelFilters === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    Todos
                  </button>
                  <button 
                    onClick={deselectAllChannels}
                    className="px-4 py-2 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    Nenhum
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                {GOFLUX_CHANNELS.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => toggleChannelFilter(channel.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isChannelSelected(channel.id)
                        ? 'bg-purple-100 text-purple-700 border border-transparent'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <i className={`fas ${channel.icon}`}></i>
                    {channel.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Persona Filter */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Filtrar por Persona</h4>
              <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <button
                  onClick={() => setPersonaFilter('none')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isPersonaSelected('none')
                      ? 'bg-emerald-100 text-emerald-700 border border-transparent'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <i className="fas fa-users-viewfinder mr-2"></i> Nenhuma
                </button>
                {Object.values(Persona).map(persona => (
                  <button
                    key={persona}
                    onClick={() => setPersonaFilter(persona)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isPersonaSelected(persona)
                        ? 'bg-emerald-100 text-emerald-700 border border-transparent'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <i className="fas fa-user-circle mr-2"></i> {persona}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* End Filter Section */}


        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-3">
            <i className="fas fa-exclamation-triangle text-lg"></i>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => handleGenerateContent()} // Call without instruction for initial generation
            disabled={isGenerating}
            className={`px-10 py-4 rounded-xl font-bold transition-all flex items-center gap-3 ${
              isGenerating
                ? 'bg-blue-300 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isGenerating ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Gerando...
              </>
            ) : (
              <>
                <i className="fas fa-rocket"></i> Gerar Conteúdo
              </>
            )}
          </button>
        </div>
      </section>

      {results && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 animate-in fade-in duration-500">
          {results.map((productContent) => (
            <ContentCard key={productContent.id} product={productContent} />
          ))}
        </section>
      )}

      {/* New: Revision Section - Appears after initial generation */}
      {results && (
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mt-8 animate-in fade-in duration-500">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fas fa-wand-magic-sparkles text-purple-500"></i> Ajustar Conteúdo Gerado
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            O conteúdo acima não está perfeito? Digite uma instrução para a IA refinar o texto para você.
            (Ex: "Torne os assuntos de e-mail mais chamativos", "Resuma os blogs para 2 tópicos", "Adicione um emoji de foguete na legenda social do Club goFlux").
          </p>
          <textarea
            id="modificationInstruction"
            className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-slate-700 leading-relaxed"
            placeholder="Ex: Torne o tom mais formal, adicione um CTA para agendamento de demo em todos os e-mails..."
            value={modificationInstruction}
            onChange={(e) => setModificationInstruction(e.target.value)}
            disabled={isGenerating}
          />
          {error && modificationInstruction && ( // Show error specifically for revision if instruction is present
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-center gap-3">
              <i className="fas fa-exclamation-triangle text-lg"></i>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleGenerateContent(modificationInstruction)} // Call with instruction for revision
              disabled={isGenerating || !modificationInstruction.trim()}
              className={`px-10 py-4 rounded-xl font-bold transition-all flex items-center gap-3 ${
                isGenerating || !modificationInstruction.trim()
                  ? 'bg-purple-300 text-white cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95'
              }`}
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Revisando...
                </>
              ) : (
                <>
                  <i className="fas fa-arrows-rotate"></i> Aplicar Modificação
                </>
              )}
            </button>
          </div>
        </section>
      )}
      {/* End New Revision Section */}

    </div>
  );

  const renderProductSettingsView = (id: ProductID) => {
    const product = GOFLUX_PRODUCTS.find(p => p.id === id);
    if (!product) return null;

    const currentProductConfig = productConfigs[id] || { 
      generalDescription: product.defaultGeneralDescription, 
      personaDescriptions: product.defaultPersonaDescriptions 
    };

    const updateProductConfig = (newData: Partial<ProductConfigData>) => {
      setProductConfigs(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          ...newData,
        },
      }));
    };

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <i className={`fas ${product.icon} text-2xl ${product.colorClass}`}></i>
            <h2 className="text-3xl font-bold text-slate-900">Configuração: {product.label}</h2>
          </div>
          <p className="text-slate-500">Ajuste o resumo geral do produto e defina o perfil de cada público para otimizar a geração de conteúdo.</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* General Description */}
          <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
            Resumo Geral do Produto
          </label>
          <textarea 
            className="w-full h-32 px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-700 leading-relaxed mb-6"
            value={currentProductConfig.generalDescription}
            onChange={(e) => updateProductConfig({ generalDescription: e.target.value })}
            placeholder="Descreva as dores que este produto resolve e seus principais benefícios para um público amplo..."
          />

          {/* Persona Specific Descriptions - Renamed section */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Definição de perfil</h3>
            <p className="text-slate-500 text-sm mb-6">
              Defina os **dados demográficos e psicográficos** de cada perfil de público. 
              Estas definições serão usadas quando uma persona específica for selecionada no Gerador para otimizar o conteúdo.
            </p>
            <div className="space-y-6">
              {Object.values(Persona).map(personaOption => (
                <div key={personaOption}>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Perfil de Público: {personaOption}
                  </label>
                  <textarea
                    className="w-full h-24 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none text-slate-700 leading-relaxed"
                    value={currentProductConfig.personaDescriptions[personaOption]}
                    onChange={(e) => 
                      updateProductConfig({
                        personaDescriptions: {
                          ...currentProductConfig.personaDescriptions,
                          [personaOption]: e.target.value,
                        },
                      })
                    }
                    placeholder={`Descreva os dados demográficos (idade, cargo, empresa) e psicográficos (dores, desejos, desafios) do ${personaOption}...`}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 flex gap-4">
            <button 
              // Directly use updateProductConfig to save changes, which will trigger the useEffect to save to localStorage
              onClick={() => updateProductConfig(currentProductConfig)} 
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <i className="fas fa-save"></i> Salvar Configuração
            </button>
            <button 
              onClick={() => {
                // Restore to default by setting state, which will trigger the useEffect to save to localStorage
                setProductConfigs(prev => ({
                  ...prev, 
                  [id]: { 
                    generalDescription: product.defaultGeneralDescription, 
                    personaDescriptions: product.defaultPersonaDescriptions 
                  } 
                }));
              }}
              className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 active:scale-95 transition-all"
            >
              Restaurar Padrão
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-3">
            <i className={`fas fa-info-circle ${product.colorClass} mt-1`}></i>
            <p className="text-sm text-blue-800">
              O **Resumo Geral do Produto** define a essência do produto. As **Definições de Perfil** detalham o público-alvo. 
              No Gerador, o filtro de "Persona" determinará se um perfil de público específico será adicionado ao contexto da IA para otimizar a geração.
            </p>
          </div>
        </section>
      </div>
    );
  };

  const renderChannelSettingsView = (id: ChannelID) => {
    const channel = GOFLUX_CHANNELS.find(c => c.id === id);
    if (!channel) return null;

    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <i className={`fas ${channel.icon} text-2xl text-purple-600`}></i>
            <h2 className="text-3xl font-bold text-slate-900">Configuração: {channel.label}</h2>
          </div>
          <p className="text-slate-500">Ajuste o prompt para personalizar a geração de conteúdo deste canal.</p>
          {/* REMOVIDO: Linha com </p> extra que causava erro de sintaxe */}
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
            Prompt para {channel.label}
          </label>
          <textarea 
            className="w-full h-80 px-4 py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none text-slate-700 leading-relaxed mb-6 font-mono text-xs" // Added font-mono and smaller text for prompts
            value={channelConfigs[id] || ''}
            onChange={(e) => setChannelConfigs({ ...channelConfigs, [id]: e.target.value })}
            placeholder={`Descreva aqui as instruções para a IA gerar o conteúdo de ${channel.label}...`}
          />
          
          <div className="flex gap-4">
            <button 
              // Directly use setChannelConfigs to save changes, which will trigger the useEffect to save to localStorage
              onClick={() => setChannelConfigs({ ...channelConfigs, [id]: channelConfigs[id] })}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <i className="fas fa-save"></i> Salvar Configuração
            </button>
            <button 
              onClick={() => {
                // Restore to default by setting state, which will trigger the useEffect to save to localStorage
                const newConfigs = { ...channelConfigs, [id]: channel.defaultPrompt };
                setChannelConfigs(newConfigs);
              }}
              className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 active:scale-95 transition-all"
            >
              Restaurar Padrão
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-start gap-3">
            <i className="fas fa-info-circle text-purple-500 mt-1"></i>
            <p className="text-sm text-purple-800">
              Este prompt será usado pela IA para criar o conteúdo de <strong>{channel.label}</strong>, substituindo as diretrizes padrão.
            </p>
          </div>
        </section>
      </div>
    );
  };


  const isProductID = (id: 'generator' | ProductID | ChannelID): id is ProductID => Object.values(ProductID).includes(id as ProductID);
  const isChannelID = (id: 'generator' | ProductID | ChannelID): id is ChannelID => Object.values(ChannelID).includes(id as ChannelID);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      
      <main className="flex-1 md:ml-64 p-4 md:p-10">
        {activeView === 'generator' ? (
          renderGeneratorView()
        ) : isProductID(activeView) ? (
          renderProductSettingsView(activeView)
        ) : isChannelID(activeView) ? (
          renderChannelSettingsView(activeView)
        ) : null}
      </main>
    </div>
  );
};

export default App;