import React, { useEffect, useRef } from 'react';
import { RouteProvider, useRoute } from './context/RouteContext.jsx';
import { AppProvider, useApp } from './context/AppContext.jsx';
import { Navbar, AppLayout, Toasts } from './components/Navigation.jsx';
import { LoadingState, ErrorState } from './components/UIPrimitives.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Unit1Page from './pages/Unit1Page.jsx';
import Unit2Page from './pages/Unit2Page.jsx';
import Unit3Page from './pages/Unit3Page.jsx';
import Unit4Page from './pages/Unit4Page.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const PAGES = {
  home: HomePage,
  unit1: Unit1Page,
  unit2: Unit2Page,
  unit3: Unit3Page,
  unit4: Unit4Page,
  teacher: TeacherDashboard
};

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

  const Page = PAGES[route] || NotFoundPage;
  return (
    <AppLayout>
      <Page />
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
