import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  PlusSquare,
  Star,
  Briefcase,
  FilePlus,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Settings,
  UserCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../AuthContext';

type NavItem = { to: string; label: string; icon: React.ElementType; end?: boolean };
type NavGroup = { heading: string; items: NavItem[] };

const NAV: NavGroup[] = [
  { heading: '', items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }] },
  {
    heading: 'Projects',
    items: [
      { to: '/admin/projects', label: 'All Projects', icon: FolderKanban, end: true },
      { to: '/admin/projects/new', label: 'Add Project', icon: PlusSquare },
      { to: '/admin/projects?featured=true', label: 'Featured Projects', icon: Star },
    ],
  },
  {
    heading: 'Jobs',
    items: [
      { to: '/admin/jobs', label: 'All Jobs', icon: Briefcase, end: true },
      { to: '/admin/jobs/new', label: 'Post Job', icon: FilePlus },
    ],
  },
  { heading: 'Recruitment', items: [{ to: '/admin/applications', label: 'Applications', icon: Users }] },
  { heading: 'Communication', items: [{ to: '/admin/queries', label: 'Queries', icon: MessageSquare }] },
  { heading: 'Content', items: [{ to: '/admin/media', label: 'Media', icon: ImageIcon }] },
  {
    heading: 'System',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
      { to: '/admin/account', label: 'Account', icon: UserCircle },
    ],
  },
];

export function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.title = 'Admin — EG Legend';
    let meta = document.querySelector('meta[name="robots"]');
    const prev = meta?.getAttribute('content') ?? null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (prev !== null) meta?.setAttribute('content', prev);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 overflow-hidden p-1 flex-shrink-0">
          <img src="/logo.jpg" alt="" className="h-full w-full object-contain" />
        </div>
        <div className="min-w-0">
          <span className="block font-display text-xl text-white leading-tight truncate">EG Legend</span>
          <span className="block text-[11px] uppercase tracking-[0.18em] text-white/40 mt-0.5">Admin</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map((group) => (
          <div key={group.heading || 'top'}>
            {group.heading && (
              <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                {group.heading}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                // NavLink's own isActive only looks at pathname (ignoring the
                // query string) and, without `end`, also matches descendant
                // routes — which would light up both "All Projects" and
                // "Featured Projects" (same pathname, different query) at
                // once, or "Featured Projects" while on /admin/projects/new.
                // Compare the full current URL against each item's own `to`
                // instead, so exactly one item is active at a time.
                const current = location.pathname + location.search;
                const isActive = item.end !== false ? current === item.to : current.startsWith(item.to);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-brand-700 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}>
                    <item.icon size={17} className="flex-shrink-0" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 mb-2">
          <div className="text-sm text-white truncate">{admin?.name || admin?.email}</div>
          <div className="text-xs text-white/40 truncate">{admin?.email}</div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors">
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream-100 font-sans text-ink">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-ink flex-col z-30">{sidebar}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-ink flex flex-col">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar (mobile) */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 h-14 bg-white border-b border-ink/10">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="p-2 -ml-2 text-ink/70">
            <Menu size={22} />
          </button>
          <span className="font-display text-lg text-ink">EG Legend Admin</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className={`p-2 -mr-2 text-ink/70 ${mobileOpen ? '' : 'invisible'}`}
            aria-label="Close menu">
            <X size={22} />
          </button>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1400px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
