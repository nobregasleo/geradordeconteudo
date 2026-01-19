
import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white p-6 flex flex-col hidden md:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <i className="fas fa-flux-capacitor text-xl"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight">goFlux <span className="text-blue-500">Engine</span></h1>
      </div>
      
      <nav className="flex-1 space-y-4">
        <div className="px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Produtos</div>
        <NavItem icon="fa-users" label="Club" />
        <NavItem icon="fa-leaf" label="carbonFree" />
        <NavItem icon="fa-laptop-code" label="SAAS" />
        <NavItem icon="fa-wallet" label="naConta" />
        <NavItem icon="fa-chart-line" label="View" />
      </nav>

      <div className="mt-auto p-4 bg-slate-800 rounded-xl">
        <p className="text-xs text-slate-400">Logado como</p>
        <p className="text-sm font-medium">Redator Sênior</p>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all">
    <i className={`fas ${icon} w-5`}></i>
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default Sidebar;
