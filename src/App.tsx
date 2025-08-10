import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import OnboardingPage from "./pages/onboarding/Onboarding";
import StudentsPage from "./pages/coach-pages/students/StudentsPage";
import ManagementPage from "./pages/coach-pages/management/ManagementPage";
import CoachProfile from "./pages/coach-pages/profile/CoachProfile";
import CoachMainPage from "./pages/coach-pages/main/CoachMainPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { useI18n } from "@/i18n/i18n";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function AppRoutes() {
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboarding";

  return (
    <div className={isOnboarding ? "" : "pt-20"}>
      <Routes>
        <Route path="/coach/main" element={<CoachMainPage />} />
        <Route path="/coach/students" element={<StudentsPage />} />
        <Route path="/coach/management" element={<ManagementPage />} />
        <Route path="/coach/profile" element={<CoachProfile />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default function App() {
  const { lang } = useI18n();
  React.useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      if (tg.isVersionAtLeast('7.7')) {
        tg.disableVerticalSwipes();
      }
    }
  }, []);

  return (
    <Router>
      <AppRoutes key={lang} />
    </Router>
  );
}
