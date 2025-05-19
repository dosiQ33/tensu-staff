// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import OnboardingPage from './pages/onboarding/Onboarding';
import MainPage2 from './pages/main/MainPage2';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/temp" element={<OnboardingPage />} />
        <Route path="/" element={<MainPage2 />} />
        {/* catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
