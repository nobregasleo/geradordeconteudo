

import React, { useState } from 'react';
import { ProductContent, GOFLUX_PRODUCTS, ChannelID } from '../types'; // Import GOFLUX_PRODUCTS and ChannelID

interface ContentCardProps {
  product: ProductContent;
}

const ContentCard: React.FC<ContentCardProps> = ({ product }) => {
  // Helper to check if a channel has generated content
  const isChannelContentAvailable = (channelId: ChannelID): boolean => {
    switch (channelId) {
      case ChannelID.EMAIL:
        return !!product.content.email && (product.content.email.body.trim() !== '' || product.content.email.subjects.length > 0);
      case ChannelID.SOCIAL:
        return !!product.content.social && (product.content.social.artText.trim() !== '' || product.content.social.caption.trim() !== '');
      case ChannelID.BLOG:
        return !!product.content.blog && (product.content.blog.title.trim() !== '' || product.content.blog.summary.length > 0);
      default:
        return false;
    }
  };

  // Determine initial active tab: first available channel, or default to email
  const initialActiveTab = [ChannelID.EMAIL, ChannelID.SOCIAL, ChannelID.BLOG].find(
    (id) => isChannelContentAvailable(id)
  ) || ChannelID.EMAIL;

  const [activeTab, setActiveTab] = useState<ChannelID>(initialActiveTab);

  // Find the product metadata to get consistent styling
  const productMetadata = GOFLUX_PRODUCTS.find(p => p.id === product.id);
  const iconClass = productMetadata?.icon || 'fa-cube';
  const colorClass = productMetadata?.colorClass || 'text-slate-500';
  const bgColorClass = productMetadata?.bgColorClass || 'bg-slate-50';
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColorClass} ${colorClass}`}>
            <i className={`fas ${iconClass} text-lg`}></i>
          </div>
          <h4 className="font-bold text-slate-800">{product.name}</h4>
        </div>
      </div>

      <div className="flex border-b border-slate-100">
        <TabButton 
          active={activeTab === ChannelID.EMAIL} 
          onClick={() => setActiveTab(ChannelID.EMAIL)} 
          icon="fa-envelope" 
          label="Email"
          disabled={!isChannelContentAvailable(ChannelID.EMAIL)}
        />
        <TabButton 
          active={activeTab === ChannelID.SOCIAL} 
          onClick={() => setActiveTab(ChannelID.SOCIAL)} 
          icon="fa-share-nodes" 
          label="Social" 
          disabled={!isChannelContentAvailable(ChannelID.SOCIAL)}
        />
        <TabButton 
          active={activeTab === ChannelID.BLOG} 
          onClick={() => setActiveTab(ChannelID.BLOG)} 
          icon="fa-file-lines" 
          label="Blog" 
          disabled={!isChannelContentAvailable(ChannelID.BLOG)}
        />
      </div>

      <div className="p-6 flex-1 overflow-y-auto max-h-[500px]">
        {activeTab === ChannelID.EMAIL && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {isChannelContentAvailable(ChannelID.EMAIL) ? (
              <>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Assuntos</span>
                  <div className="space-y-2 mt-1">
                    {product.content.email?.subjects.map((subject, idx) => (
                      <p key={idx} className="text-slate-900 font-medium p-2 bg-slate-50 rounded border border-slate-100">
                        {subject}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Corpo</span>
                  <div className="text-slate-700 text-sm mt-2 whitespace-pre-wrap leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100">
                    {product.content.email?.body}
                  </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(`${product.content.email?.subjects.join('\n\n')}\n\n${product.content.email?.body}`)}
                  className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
                >
                  <i className="fas fa-copy"></i> Copiar Email
                </button>
              </>
            ) : (
              <div className="text-center text-slate-500 italic p-8 bg-slate-50 rounded-xl border border-slate-100">
                Conteúdo não gerado para Email Marketing na última requisição.
              </div>
            )}
          </div>
        )}

        {activeTab === ChannelID.SOCIAL && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {isChannelContentAvailable(ChannelID.SOCIAL) ? (
              <>
                <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center p-6 text-center text-white relative group">
                  <span className="text-lg font-bold leading-tight uppercase tracking-tight italic">
                    {product.content.social?.artText}
                  </span>
                  <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-100 transition-opacity">
                    <i className="fas fa-image text-white"></i>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Legenda</span>
                  <div className="text-slate-700 text-sm mt-2 whitespace-pre-wrap leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100 italic">
                    {product.content.social?.caption}
                  </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(product.content.social?.caption || '')}
                  className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
                >
                  <i className="fas fa-copy"></i> Copiar Legenda
                </button>
              </>
            ) : (
              <div className="text-center text-slate-500 italic p-8 bg-slate-50 rounded-xl border border-slate-100">
                Conteúdo não gerado para Redes Sociais na última requisição.
              </div>
            )}
          </div>
        )}

        {activeTab === ChannelID.BLOG && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {isChannelContentAvailable(ChannelID.BLOG) ? (
              <>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Título Blog</span>
                  <p className="text-slate-900 font-bold text-lg mt-1">{product.content.blog?.title}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Tópicos do Artigo</span>
                  <ul className="space-y-2">
                    {product.content.blog?.summary.map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border-l-2 border-blue-500">
                        <span className="font-bold text-blue-500">{idx + 1}.</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 italic p-8 bg-slate-50 rounded-xl border border-slate-100">
                Conteúdo não gerado para Artigo de Blog na última requisição.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string; disabled: boolean }> = ({ active, onClick, icon, label, disabled }) => (
  <button 
    onClick={disabled ? undefined : onClick} // Prevent onClick if disabled
    className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all border-b-2 
      ${active 
        ? 'text-blue-600 border-blue-600 bg-blue-50/30' 
        : (disabled 
          ? 'text-slate-400 border-transparent opacity-50 italic cursor-not-allowed' // Disabled style
          : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50') // Enabled hover style
      }`
    }
    disabled={disabled} // Set native disabled attribute
  >
    <i className={`fas ${icon}`}></i>
    {label}
  </button>
);

export default ContentCard;