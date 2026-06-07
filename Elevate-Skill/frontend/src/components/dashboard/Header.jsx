import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, UserCog, LogOut } from 'lucide-react';

export default function Header({
  title,
  user,
  onToggleSidebar,
  sidebarOpen,
  onLogout,
  actions
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-brand-card/90 backdrop-blur-xl border-b border-brand-border px-6 py-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-brand-bg/5 text-brand-muted hover:text-brand-text transition-all cursor-pointer"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="h-5 w-px bg-brand-border" />
        <span className="text-sm font-medium text-brand-muted capitalize">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        {actions}

        <button className="relative p-2 rounded-lg hover:bg-brand-bg/5 text-brand-muted hover:text-brand-text transition-all cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-orange rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-orange to-brand-primary flex items-center justify-center text-white font-black text-xs hover:scale-105 transition-transform cursor-pointer"
          >
            {(user?.full_name || 'U')[0]}
          </button>
          <AnimatePresence>
            {profileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 z-50 bg-brand-card border border-brand-border rounded-xl shadow-xl shadow-black/50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-brand-border">
                    <p className="text-xs font-bold text-brand-text truncate">{user?.full_name}</p>
                    <p className="text-[10px] text-brand-muted truncate">{user?.email}</p>
                  </div>
                  <button
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-brand-muted hover:bg-brand-bg/5 transition-all cursor-pointer"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <UserCog size={14} /> Profile
                  </button>
                  <button
                    onClick={() => { setProfileMenuOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#D95C4A] hover:bg-red-900/20 transition-all border-t border-brand-border cursor-pointer"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
