import { Link, Outlet } from 'react-router-dom';
import { ShieldAlert, Map as MapIcon, LogIn } from 'lucide-react';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">CivicConnect</span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
              About
            </Link>
            <Link to="/map" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2 transition">
              <MapIcon className="w-4 h-4" />
              Public Map
            </Link>
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign in
            </Link>
            <Link to="/signup" className="text-sm rounded-md bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition">
              Report an Issue
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldAlert className="w-6 h-6" />
            <span className="font-bold tracking-tight">CivicConnect</span>
          </div>
          <p className="text-sm text-slate-500">© 2026 CivicConnect Public Services Platform. Transparency & Accountability.</p>
        </div>
      </footer>
    </div>
  );
}
