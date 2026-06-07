import { GraduationCap, LogOut, ChevronDown } from 'lucide-react';

export default function Sidebar({
  items,
  activeTab,
  onTabChange,
  onLogout,
  logo,
  title,
  subtitle,
  children
}) {
  return (
    <aside className="sidebar-fixed bg-brand-card border-r border-brand-border flex flex-col z-40">
      <div className="px-5 py-6 border-b border-brand-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-brand-primary flex items-center justify-center shrink-0">
            {logo || <GraduationCap size={20} className="text-white" />}
          </div>
          <div className="min-w-0">
            <h3 className="text-brand-text font-black text-sm tracking-tight truncate">{title || 'Dashboard'}</h3>
            <p className="text-brand-muted text-[10px] font-medium truncate">{subtitle || 'Elevate Skill'}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map(item => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (item.children) {
                  onTabChange(item.id);
                } else {
                  onTabChange(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.id || (item.children?.some(c => c.id === activeTab))
                  ? 'bg-brand-primary/10 text-brand-primary'
                  : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg/5'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.children && (
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform ${
                    item.children.some(c => c.id === activeTab) ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>
            {item.children && item.children.some(c => c.id === activeTab) && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => onTabChange(child.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeTab === child.id
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'text-brand-muted hover:text-brand-text hover:bg-brand-bg/5'
                    }`}
                  >
                    <span className="shrink-0">{child.icon}</span>
                    <span className="truncate">{child.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {children}

      <div className="px-3 py-4 border-t border-brand-border shrink-0">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[#D95C4A] hover:bg-red-900/20 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
