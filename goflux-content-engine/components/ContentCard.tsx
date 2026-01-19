
import React, { useState } from 'react';
import { ProductContent } from '../types';

interface ContentCardProps {
  product: ProductContent;
}

const ContentCard: React.FC<ContentCardProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'social' | 'blog'>('email');

  const getProductStyling = (id: string) => {
    switch (id.toLowerCase()) {
      case 'club': return { icon: 'fa-users', color: 'text-blue-500', bg: 'bg-blue-50' };
      case 'carbonfree': return { icon: 'fa-leaf', color: 'text-green-500', bg: 'bg-green-50' };
      case 'saas': 
      case 'goflux saas': return { icon: 'fa-laptop-code', color: 'text-indigo-500', bg: 'bg-indigo-50' };
      case 'naconda': return { icon: 'fa-wallet', color: 'text-amber-500', bg: 'bg-amber-50' };
      case 'view': return { icon: 'fa-chart-line', color: 'text-purple-500', bg: 'bg-purple-50' };
      default: return { icon: 'fa-cube', color: 'text-slate-500', bg: 'bg-slate-50' };
    }
  };

  const style = getProductStyling(product.id);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado para a área de transferência!');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bg} ${style.color}`}>
            <i className={`fas ${style.icon} text-lg`}></i>
          </div>
          <h4 className="font-bold text-slate-800">{product.name}</h4>
        </div>
      </div>

      <div className="flex border-b border-slate-100">
        <TabButton active={activeTab === 'email'} onClick={() => setActiveTab('email')} icon="fa-envelope" label="Email" />
        <TabButton active={activeTab === 'social'} onClick={() => setActiveTab('social')} icon="fa-share-nodes" label="Social" />
        <TabButton active={activeTab === 'blog'} onClick={() => setActiveTab('blog')} icon="fa-file-lines" label="Blog" />
      </div>

      <div className="p-6 flex-1 overflow-y-auto max-h-[500px]">
        {activeTab === 'email' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Assunto</span>
              <p className="text-slate-900 font-medium mt-1 p-2 bg-slate-50 rounded border border-slate-100">
                {product.content.email.subject}
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Corpo</span>
              <div className="text-slate-700 text-sm mt-2 whitespace-pre-wrap leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100">
                {product.content.email.body}
              </div>
            </div>
            <button 
              onClick={() => copyToClipboard(`${product.content.email.subject}\n\n${product.content.email.body}`)}
              className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
            >
              <i className="fas fa-copy"></i> Copiar Email
            </button>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center p-6 text-center text-white relative group">
              <span className="text-lg font-bold leading-tight uppercase tracking-tight italic">
                {product.content.social.artText}
              </span>
              <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-100 transition-opacity">
                <i className="fas fa-image text-white"></i>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Legenda</span>
              <div className="text-slate-700 text-sm mt-2 whitespace-pre-wrap leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-100 italic">
                {product.content.social.caption}
              </div>
            </div>
            <button 
              onClick={() => copyToClipboard(product.content.social.caption)}
              className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:underline"
            >
              <i className="fas fa-copy"></i> Copiar Legenda
            </button>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Título Blog</span>
              <p className="text-slate-900 font-bold text-lg mt-1">{product.content.blog.title}</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Tópicos do Artigo</span>
              <ul className="space-y-2">
                {product.content.blog.summary.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border-l-2 border-blue-500">
                    <span className="font-bold text-blue-500">{idx + 1}.</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-all border-b-2 ${
      active ? 'text-blue-600 border-blue-600 bg-blue-50/30' : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50'
    }`}
  >
    <i className={`fas ${icon}`}></i>
    {label}
  </button>
);

export default ContentCard;
