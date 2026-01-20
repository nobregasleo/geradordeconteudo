

import React from 'react';
import { GOFLUX_PRODUCTS, ProductID, GOFLUX_CHANNELS, ChannelID } from '../types';

interface SidebarProps {
  activeView: 'generator' | ProductID | ChannelID; // Reverted type
  onNavigate: (view: 'generator' | ProductID | ChannelID) => void; // Reverted type
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white p-6 flex flex-col hidden md:flex">
      <div className="mb-10 flex items-center gap-3">
        {/* Removed the blue square div */}
        <h1 className="text-xl font-bold tracking-tight">go<span className="text-red-500">Flow</span></h1> {/* Changed title and color */}
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

        {/* Removed: New item for Content Revisor */}

        <div className="px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6">Configurar Produtos</div>
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

        {/* New section for channels */}
        <div className="px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-6">Configurar Canais</div>
        {GOFLUX_CHANNELS.map((channel) => (
          <div 
            key={channel.id}
            onClick={() => onNavigate(channel.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
              activeView === channel.id ? 'bg-slate-700 text-purple-400 border-l-4 border-purple-500' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <i className={`fas ${channel.icon} w-5`}></i>
            <span className="text-sm font-medium">{channel.label}</span>
          </div>
        ))}
      </nav>

      
    </div>
  );
};

export default Sidebar;