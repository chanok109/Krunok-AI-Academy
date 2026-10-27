import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ROUTES } from '../data/courseData.js';

export function readRoute() {
  let h = '';
  try {
    h = (window.location.hash || '').replace(/^#\/?/, '');
  } catch (e) {}
  if (!h) return 'home';
  return ROUTES[h] ? h : 'notfound:' + h;
}

export const RouteContext = createContext(null);
export const useRoute = () => useContext(RouteContext);

export function RouteProvider({ children }) {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback(key => {
    setRoute(key);
    try {
      if (window.location.hash !== '#' + key) {
        window.history.replaceState(null, '', '#' + key);
      }
    } catch (e) {}
    try {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (e) {}
  }, []);

  return (
    <RouteContext.Provider value={{ route, navigate }}>
      {children}
    </RouteContext.Provider>
  );
}
