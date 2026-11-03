import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { useTheme } from '../../features/settings/ThemeContext';
import { 
  Calendar, 
  Sparkles, 
  BookOpen, 
  Sliders, 
  LogOut, 
  LogIn,
  Menu, 
  X, 
  Palette
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme, themes } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/schedules', label: 'Schedules', icon: Calendar },
    { to: '/builder', label: 'Build a Schedule', icon: Sparkles },
    { to: '/offerings', label: 'Offerings', icon: BookOpen },
    { to: '/settings', label: 'Settings', icon: Sliders },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const currentTheme = themes.find(t => t.key === theme);

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border-subtle bg-surface px-4 py-5 shrink-0 justify-between">
        <div>
          {/* Logo / Brand header */}
          <div className="flex items-center gap-2.5 px-2 pb-5 mb-4 border-b border-border-subtle">
            <div className="w-8 h-8 rounded-md bg-accent text-accent-contrast flex items-center justify-center font-serif font-bold text-sm tracking-wider shadow-soft">
              SP
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-fg block">
                Schedule Planner
              </span>
              <span className="text-[11px] text-fg-muted block">
                Timetable Workspace
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-accent-surface text-fg font-semibold'
                        : 'text-fg-secondary hover:text-fg hover:bg-surface-secondary'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile & theme switch bottom section */}
        <div className="pt-4 border-t border-border-subtle space-y-3">
          {/* Theme Quick Selector */}
          <div className="px-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wider text-fg-muted font-semibold flex items-center gap-1">
                <Palette size={11} /> Theme
              </span>
              <span className="text-[10px] text-fg font-medium">
                {currentTheme?.name}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {themes.slice(0, 8).map((t) => (
                <button
                  key={t.key}
                  type="button"
                  title={t.name}
                  onClick={() => setTheme(t.key)}
                  className={`h-5 rounded border transition-all ${
                    theme === t.key ? 'ring-2 ring-accent scale-105' : 'hover:scale-105 opacity-80'
                  }`}
                  style={{ backgroundColor: t.sampleBg, borderColor: t.sampleAccent }}
                />
              ))}
            </div>
          </div>

          {/* User & Optional Sign-in/out */}
          <div className="flex items-center justify-between px-2 pt-2 text-xs border-t border-border-subtle">
            {user ? (
              <>
                <div className="truncate pr-2">
                  <span className="font-medium text-fg block truncate">
                    {user.username}
                  </span>
                  <span className="text-[10px] text-fg-muted block truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-md text-fg-muted hover:text-status-danger hover:bg-surface-secondary transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </>
            ) : (
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-fg-muted text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                  <span>Guest Student</span>
                </div>
                <Link
                  to="/auth"
                  className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
                >
                  <LogIn size={13} /> Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-accent text-accent-contrast flex items-center justify-center font-bold text-xs">
            SP
          </div>
          <span className="font-medium text-xs text-fg">Schedule Planner</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md text-fg-secondary hover:bg-surface-secondary"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border-subtle px-4 py-3 space-y-2">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-accent-surface text-fg font-semibold'
                        : 'text-fg-secondary hover:text-fg'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-xs">
            {user ? (
              <>
                <span className="text-fg-secondary">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-status-danger flex items-center gap-1 font-medium"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="text-accent flex items-center gap-1 font-medium"
              >
                <LogIn size={14} /> Optional Sign in
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation for quick thumb reach */}
      <nav className="md:hidden sticky bottom-0 bg-surface/95 backdrop-blur border-t border-border-subtle px-2 py-1.5 flex justify-around text-[10px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-1 px-3 rounded-md transition-colors ${
                  isActive ? 'text-fg font-semibold' : 'text-fg-muted'
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
