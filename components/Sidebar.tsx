
import React from 'react';
import { GOFLUX_PRODUCTS, ProductID } from '../types';

interface SidebarProps {
  activeView: 'generator' | ProductID;
  onNavigate: (view: 'generator' | ProductID) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white p-6 flex flex-col hidden md:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-flux-capacitor text-xl"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight">goFlux <span className="text-blue-500">Engine</span></h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        <div 
          onClick={() => onNavigate('generator')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all mb-6 ${
            activeView === 'generator' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <i className="fas fa-magic w-5"></i>
          <span className="text-sm font-bold">Gerador</span>
        </div>

        <div className="px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Configurar Produtos</div>
        {GOFLUX_PRODUCTS.map((prod) => (
          <div 
            key={prod.id}
            onClick={() => onNavigate(prod.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
              activeView === prod.id ? 'bg-slate-700 text-blue-400 border-l-4 border-blue-500' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i className={`fas ${prod.icon} w-5`}></i>
            <span className="text-sm font-medium">{prod.label}</span>
          </div>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-slate-800 rounded-xl">
        <p className="text-xs text-slate-400">Logado como</p>
        <p className="text-sm font-medium">Redator Sênior</p>
      </div>
    </div>
  );
};

export default Sidebar;
