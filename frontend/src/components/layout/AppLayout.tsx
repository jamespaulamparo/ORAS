import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
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
  Home,
  Info,
  Layers
} from 'lucide-react';
import { OrasLogo } from '../ui/OrasLogo';
import { ScheduleWorkspaceSidebar } from './ScheduleWorkspaceSidebar';
import { motion } from 'framer-motion';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, themes, currentTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [forceMainNav, setForceMainNav] = useState(false);

  const isScheduleRoute = location.pathname === '/schedules';
  const showWorkspaceSidebar = isScheduleRoute && !forceMainNav;

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/schedules', label: 'Timetable', icon: Calendar },
    { to: '/builder', label: 'Build a Schedule', icon: Sparkles },
    { to: '/offerings', label: 'Offerings', icon: BookOpen },
    { to: '/about', label: 'About & Research', icon: Info },
    { to: '/settings', label: 'Settings', icon: Sliders },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row">
      {/* Conditionally Render Ellipsus Workspace Tool Rail vs Main Navigation Sidebar */}
      {showWorkspaceSidebar ? (
        <ScheduleWorkspaceSidebar
          onSwitchToMainNav={() => setForceMainNav(true)}
        />
      ) : (
        <aside className="hidden md:flex flex-col w-64 border-r border-border-subtle bg-surface px-4 py-5 shrink-0 justify-between select-none">
          <div>
            {/* Logo / Brand header */}
            <div className="flex items-center justify-between px-2 pb-5 mb-4 border-b border-border-subtle">
              <Link to="/" className="flex items-center gap-2 group">
                <OrasLogo size="md" />
              </Link>
              {isScheduleRoute && (
                <button
                  type="button"
                  onClick={() => setForceMainNav(false)}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-accent text-accent-contrast shadow-xs hover:bg-accent-hover transition-colors"
                >
                  Tools
                </button>
              )}
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
                      `flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                        isActive
                          ? 'bg-accent-surface text-fg font-bold shadow-xs'
                          : 'text-fg-secondary hover:text-fg hover:bg-surface-secondary'
                      }`
                    }
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* User profile & session bottom section */}
          <div className="pt-4 border-t border-border-subtle space-y-3">
            {/* Active Theme indicator with direct link to Settings */}
            <Link
              to="/settings"
              className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-surface-secondary text-xs transition-colors group"
            >
              <span className="text-[11px] text-fg-muted font-medium flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border shadow-xs"
                  style={{ backgroundColor: currentTheme?.sampleAccent || 'var(--accent)' }}
                />
                <span>Theme</span>
              </span>
              <span className="text-[11px] text-fg font-bold group-hover:text-accent transition-colors">
                {currentTheme?.name}
              </span>
            </Link>

            {/* User & Optional Sign-in/out */}
            <div className="flex items-center justify-between px-2 pt-2 text-xs border-t border-border-subtle">
              {user ? (
                <>
                  <div className="truncate pr-2">
                    <span className="font-bold text-fg block truncate text-[11px]">
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
                    <LogOut size={14} />
                  </button>
                </>
              ) : (
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-fg-muted text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
                    <span>Guest Session</span>
                  </div>
                  <Link
                    to="/auth"
                    className="text-xs text-accent font-bold hover:underline flex items-center gap-1"
                  >
                    <LogIn size={13} /> Sign in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface border-b border-border-subtle">
        <Link to="/" className="flex items-center gap-2">
          <OrasLogo size="sm" />
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md text-fg-secondary hover:bg-surface-secondary transition-colors"
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
                    `flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                      isActive
                        ? 'bg-accent-surface text-fg font-bold'
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
                  className="text-status-danger flex items-center gap-1 font-semibold"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="text-accent flex items-center gap-1 font-semibold"
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
      <nav className="md:hidden sticky bottom-0 bg-surface/95 backdrop-blur border-t border-border-subtle px-2 py-1.5 flex justify-around text-[10px] z-30">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-md transition-colors ${
                  isActive ? 'text-fg font-bold' : 'text-fg-muted'
                }`
              }
            >
              <Icon size={17} />
              <span>{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
