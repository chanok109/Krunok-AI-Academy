import React from 'react';
import { useRoute } from '../context/RouteContext.jsx';
import { Icon, AIraBot, GlassCard, Button, ErrorState } from '../components/UIPrimitives.jsx';

function NotFoundPage() {
  const {
    navigate
  } = useRoute();
  return React.createElement(ErrorState, {
    title: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49",
    message: "\u0E25\u0E34\u0E07\u0E01\u0E4C\u0E2D\u0E32\u0E08\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E1C\u0E34\u0E14\u0E2B\u0E23\u0E37\u0E2D\u0E2B\u0E19\u0E49\u0E32\u0E19\u0E35\u0E49\u0E16\u0E39\u0E01\u0E22\u0E49\u0E32\u0E22",
    action: React.createElement(Button, {
      icon: "home",
      onClick: () => navigate("home")
    }, "\u0E01\u0E25\u0E31\u0E1A\u0E2B\u0E19\u0E49\u0E32\u0E2B\u0E25\u0E31\u0E01")
  });
}


export default NotFoundPage;
export { NotFoundPage };
