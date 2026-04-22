import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, PlusCircle, Bell, Settings, LogOut, ShieldAlert, Flame, Moon, Sun } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout({ role = 'citizen' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const citizenNav = [
    { name: 'Dashboard', href: '/citizen', icon: LayoutDashboard },
    { name: 'My Complaints', href: '/citizen/complaints', icon: FileText },
    { name: 'Report Issue', href: '/citizen/report', icon: PlusCircle },
    { name: 'Notifications', href: '/citizen/notifications', icon: Bell },
    { name: 'Settings', href: '/citizen/settings', icon: Settings },
  ];

  const adminNav = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'All Complaints', href: '/admin/complaints', icon: FileText },
    { name: 'Hotspots', href: '/admin/hotspots', icon: Flame },
    { name: 'Staff Assigned', href: '/admin/staff', icon: ShieldAlert },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const nav = role === 'admin' ? adminNav : citizenNav;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col hidden md:flex transition-colors duration-200">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">CivicConnect</span>
          </Link>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-4 px-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Welcome</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
          </div>
          <div className="space-y-1">
            {nav.map((item) => {
              const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/citizen' && item.href !== '/admin');
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-blue-50 text-blue-700 dark:bg-slate-800/50 dark:text-blue-400" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            Sign out
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        {/* Mobile Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:hidden transition-colors duration-200">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">CivicConnect</span>
            </Link>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
