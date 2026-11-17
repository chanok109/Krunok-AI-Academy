import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { RouteProvider, useRoute } from './context/RouteContext.jsx';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Navbar, AppLayout, Toasts } from './components/Navigation.jsx';
import { LoadingState, ErrorState, Button } from './components/UIPrimitives.jsx';
import { UNITS, unitLocked } from './data/courseData.js';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Unit pages and the teacher dashboard load on demand, so login and home download less up front
const LOADERS = {
  unit1: () => import('./pages/Unit1Page.jsx'),
  unit2: () => import('./pages/Unit2Page.jsx'),
  unit3: () => import('./pages/Unit3Page.jsx'),
  unit4: () => import('./pages/Unit4Page.jsx'),
  teacher: () => import('./pages/TeacherDashboard.jsx')
};
const PAGES = {
  home: HomePage,
  ...Object.fromEntries(Object.entries(LOADERS).map(([k, load]) => [k, lazy(load)]))
};
// warm the cache once the app is idle, so opening a unit is still instant
const prefetchPages = () => Object.values(LOADERS).forEach(load => load().catch(() => {}));

function Router() {
  const { status, student } = useApp();
  const { route, navigate } = useRoute();
  const booted = useRef(false);

  useEffect(() => {
    if (status !== 'ready') return;
    if (!student && route !== 'login') navigate('login');
    if (!booted.current) {
      booted.current = true;
      if (student && route === 'login') navigate('home');
    }
  }, [status, student, route, navigate]);

  useEffect(() => {
    if (!student) return undefined;
    const idle = window.requestIdleCallback || (cb => setTimeout(cb, 1500));
    const id = idle(prefetchPages);
    return () => (window.cancelIdleCallback || clearTimeout)(id);
  }, [student]);

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <div className="content">
          <LoadingState text="กำลังเตรียมห้องเรียนของเธอ…" />
        </div>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <Navbar />
        <div className="content">
          <ErrorState
            title="โหลดข้อมูลไม่สำเร็จ"
            message="เบราว์เซอร์อาจปิดการเก็บข้อมูลไว้ ลองโหลดหน้าใหม่อีกครั้ง"
          />
        </div>
      </>
    );
  }

  if (!student || route === 'login') {
    return (
      <>
        <Navbar />
        <main id="main">
          <LoginPage />
        </main>
      </>
    );
  }

  if (unitLocked(route, student)) {
    const u = UNITS.find(x => x.id === route);
    return (
      <AppLayout>
        <ErrorState
          title={`หน่วยที่ ${u?.no ?? ''} ยังไม่เปิดให้เรียน`}
          message="ครูกำลังเตรียมเนื้อหา เร็วๆ นี้"
          action={<Button icon="home" onClick={() => navigate('home')}>กลับหน้าหลัก</Button>}
        />
      </AppLayout>
    );
  }
  const Page = PAGES[route] || NotFoundPage;
  return (
    <AppLayout>
      <Suspense fallback={<LoadingState text="กำลังเปิดบทเรียน…" />}>
        <Page />
      </Suspense>
    </AppLayout>
  );
}

export default function App() {
  return (
    <RouteProvider>
      <AppProvider>
        <Router />
        <Toasts />
      </AppProvider>
    </RouteProvider>
  );
}
