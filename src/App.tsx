// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import OnboardingPage from './pages/onboarding/Onboarding';
import MainPage from './pages/main/MainPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/temp" element={<OnboardingPage />} />
        <Route path="/" element={<MainPage />} />
        {/* catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
