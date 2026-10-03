import { NavLink, Link, Outlet } from 'react-router-dom';
import {
  PenTool,
  Home,
  BookOpen,
  Palette,
  Timer,
  Images,
  TrendingUp,
  Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Toasts from './Toasts';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '首页', icon: Home, end: true },
  { to: '/courses', label: '课程', icon: BookOpen },
  { to: '/studio', label: '画室', icon: Palette },
  { to: '/practice', label: '练习', icon: Timer },
  { to: '/gallery', label: '画廊', icon: Images },
  { to: '/progress', label: '进度', icon: TrendingUp },
];

/** 移动端底部导航：展示频次最高的 5 项 */
const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) => item.to !== '/progress');

function navLinkClass({ isActive }: { isActive: boolean }): string {
  const base =
    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors';
  return isActive
    ? `${base} bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400`
    : `${base} text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100`;
}

/** 全局布局：顶部导航 + 内容区 + 移动端底部导航 */
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/85">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2" aria-label="画伴首页">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-500 text-white shadow-sm">
              <PenTool size={18} aria-hidden="true" />
            </span>
            <span className="text-lg font-bold tracking-tight">画伴</span>
            <span className="hidden text-xs text-zinc-400 sm:inline">DrawMate</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                <item.icon size={16} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <NavLink
            to="/settings"
            aria-label="设置"
            className={({ isActive }) =>
              `grid h-9 w-9 place-items-center rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`
            }
          >
            <Settings size={18} aria-hidden="true" />
          </NavLink>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 md:pb-10">
        <Outlet />
      </main>

      <footer className="hidden border-t border-zinc-200 py-6 text-center text-xs text-zinc-400 dark:border-zinc-800 md:block">
        画伴 DrawMate · MIT License · 数据仅保存在你的浏览器中
      </footer>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95 md:hidden"
        aria-label="移动端导航"
      >
        <div className="flex h-14 items-stretch">
          {MOBILE_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`
              }
            >
              <item.icon size={20} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <Toasts />
    </div>
  );
}
