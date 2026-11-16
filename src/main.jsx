import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import './styles/components.css';
import './styles/lightTheme.css';
import './styles/unit1KnowledgeSheet.css';
import './styles/unit1Page.css';

import { COURSE, UNITS, QUIZ_PASS_PERCENT, NAV_ORDER, ROUTES } from './data/courseData.js';
import { AIraBot } from './components/UIPrimitives.jsx';
import { pad2, AiraTip, Callout, Feedback, FlipCard, Accordion, Celebrate, Modal } from './components/UIHelpers.jsx';
import { HoloStage, Particles } from './components/BackgroundEffects.jsx';
import { UnitArt } from './pages/HomePage.jsx';

window.React = React;
window._extends = Object.assign;
window.COURSE = COURSE;
window.UNITS = UNITS;
window.QUIZ_PASS_PERCENT = QUIZ_PASS_PERCENT;
window.NAV_ORDER = NAV_ORDER;
window.ROUTES = ROUTES;
window.AIraBot = AIraBot;
window.pad2 = pad2;
window.AiraTip = AiraTip;
window.Callout = Callout;
window.Feedback = Feedback;
window.FlipCard = FlipCard;
window.Accordion = Accordion;
window.Celebrate = Celebrate;
window.Modal = Modal;
window.HoloStage = HoloStage;
window.Particles = Particles;
window.UnitArt = UnitArt;
window.useState = React.useState;
window.useEffect = React.useEffect;
window.useRef = React.useRef;
window.useCallback = React.useCallback;
window.useMemo = React.useMemo;
window.useContext = React.useContext;
window.createContext = React.createContext;

try {
  document.documentElement.lang = 'th';
} catch (e) {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
