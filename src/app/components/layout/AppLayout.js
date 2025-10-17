// src/components/layout/AppLayout.js
import React from 'react';

// Placeholder for the main header (Search Bar, Bell, User Profile Icon)
const Header = () => (
  <header className="bg-white shadow-sm p-4 border-b border-gray-200 sticky top-0 z-10">
    <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <span className="text-xl font-bold text-brand-dark lg:hidden">PasantesRD</span> 
        
        {/* 1. Search Bar (Image 3) */}
        <div className="hidden lg:block w-96 relative">
          <input 
            type="text" 
            placeholder="Encuentra tu Práctica ideal" 
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg text-sm"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>
      
      {/* 2. Right Side: Notification Bell & User Profile */}
      <div className="flex items-center space-x-4">
        <div className="relative p-2 cursor-pointer">
          <span className="text-xl text-brand-dark">🔔</span> 
          <span className="absolute top-1 right-1 h-2 w-2 bg-brand-red rounded-full"></span>
        </div>
        
        <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white font-semibold cursor-pointer">
          U
        </div>
      </div>
    </div>
  </header>
);

// Minimal Footer
const Footer = () => (
    <footer className="bg-gray-100 p-4 text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} PasantesRD. Todos los derechos reservados.
    </footer>
);


export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}