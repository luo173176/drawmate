import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import CourseListPage from '@/pages/CourseListPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import StudioPage from '@/pages/StudioPage';
import PracticeHubPage from '@/pages/PracticeHubPage';
import PracticeSessionPage from '@/pages/PracticeSessionPage';
import GalleryPage from '@/pages/GalleryPage';
import ProgressPage from '@/pages/ProgressPage';
import SettingsPage from '@/pages/SettingsPage';
import { useSettingsStore } from '@/stores/settingsStore';

/** 根据设置把 dark class 挂到 <html> 上；system 模式监听系统变化 */
function useTheme() {
  const theme = useSettingsStore((s) => s.theme);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply();
    if (theme === 'system') {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
  }, [theme]);
}

export default function App() {
  useTheme();

  return (
    // 纯静态托管（GitHub Pages）下 HashRouter 无需服务端 404 回退，刷新不会 404
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/course/:courseId" element={<CourseDetailPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/practice" element={<PracticeHubPage />} />
          <Route path="/practice/:type" element={<PracticeSessionPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
