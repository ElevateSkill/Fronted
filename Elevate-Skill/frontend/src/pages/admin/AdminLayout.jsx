import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, LogOut, Menu, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnnouncementBar from '../../components/AnnouncementBar';
import { tabs } from './components/AdminShared';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const activeTab = tabs.find((t) => {
    if (t.path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(t.path);
  })?.id || 'overview';

  useEffect(() => {
    if (window.__adminPendingPayments !== undefined) {
      setPendingCount(window.__adminPendingPayments);
    }
    const interval = setInterval(() => {
      if (window.__adminPendingPayments !== undefined) {
        setPendingCount(window.__adminPendingPayments);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (mobileSidebar) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebar]);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#15c8fb] to-[#f89f29] shadow-lg shadow-[#15c8fb]/20">
          <span className="text-sm font-black text-white">ES</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white">ElevateSkill</p>
          <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-white/60">Admin panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5">
        {tabs.map(({ id, label, icon: Icon, path }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => { navigate(path); setMobileSidebar(false); }}
              className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#15c8fb]/15 to-transparent text-white'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[#15c8fb]" />
              )}
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-white shadow-sm shadow-[#15c8fb]/30'
                  : 'text-white/60'
              }`}>
                <Icon size={15} />
              </span>
              <span className="flex-1 text-left">{label}</span>
              {id === 'payments' && pendingCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-[#15c8fb] to-[#f89f29] px-1.5 text-[10px] font-black text-white shadow-sm shadow-[#15c8fb]/20">
                  {pendingCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#15c8fb] to-[#f89f29] text-xs font-black text-white shadow-sm">
            {user?.full_name?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user?.full_name || user?.username || 'Admin'}</p>
            <p className="truncate text-[11px] font-medium text-white/60 capitalize">{user?.role || 'admin'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-all"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0e14] text-gray-900 dark:text-white transition-colors duration-300">
      <AnnouncementBar />

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-white/[0.06] bg-[#0d1117] p-4 overflow-y-auto flex flex-col lg:block">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebar(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-60 border-r border-white/[0.06] bg-[#0d1117] p-4 shadow-2xl overflow-y-auto flex flex-col"
            >
              <button onClick={() => setMobileSidebar(false)} className="absolute top-4 right-4 rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-all" aria-label="Close menu">
                <X size={18} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-gray-200/50 dark:border-white/[0.06] bg-white/80 dark:bg-[#0d1117]/80 px-4 py-3 backdrop-blur-xl lg:px-6 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/admin')} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/10 transition-all hover:text-[#15c8fb]" title="Back to Dashboard">
                <ArrowLeft size={18} />
              </button>
              <button onClick={() => setMobileSidebar(true)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/10 lg:hidden">
                <Menu size={18} />
              </button>
              <div className="h-5 w-px bg-gray-200 dark:bg-white/10 lg:hidden" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#15c8fb]">Admin dashboard</p>
                <h1 className="text-lg font-black text-gray-900 dark:text-white capitalize">{activeTab.replace('-', ' ')}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 dark:text-white/40 hover:bg-gray-100 dark:hover:bg-white/10 transition-all hover:text-[#15c8fb]"
                title="Refresh"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
          <div className="mt-3 flex gap-1.5 overflow-x-auto lg:hidden">
            {tabs.map(({ id, label, path }) => (
              <button
                key={id}
                onClick={() => { navigate(path); setMobileSidebar(false); }}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  activeTab === id
                    ? 'bg-gradient-to-r from-[#15c8fb] to-[#f89f29] text-white shadow-sm'
                    : 'bg-white dark:bg-white/5 text-gray-500 dark:text-white/50 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <div className="p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-[#15c8fb]/10 dark:border-[#15c8fb]/5 bg-gradient-to-r from-[#15c8fb]/5 to-transparent p-3 sm:p-4 text-sm text-gray-600 dark:text-white/50"
          >
            Signed in as <strong className="text-gray-900 dark:text-white">{user?.full_name || user?.username}</strong>
          </motion.div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}
