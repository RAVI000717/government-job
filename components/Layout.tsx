
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.hash = ''}>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">G</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">GovTest <span className="text-indigo-600">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Exams</button>
            <button className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Resources</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-sm">Sign In</button>
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} GovTest AI. All Rights Reserved. Prepared for Success.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
