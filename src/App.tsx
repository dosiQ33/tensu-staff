// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import OnboardingPage from "./pages/onboarding/Onboarding";
import MainPage2 from "./pages/student-pages/main/MainPage2";
import ClubPage from "./pages/student-pages/main/ClubPage";
import StatsPage from "./pages/student-pages/stats/StatsPage";
import TrainingsPage from "./pages/student-pages/trainings/TrainingsPage";
import ProfilePage from "./pages/student-pages/profile/ProfilePage";
import StudentsPage from "./pages/coach-pages/students/StudentsPage";
import ManagementPage from "./pages/coach-pages/management/ManagementPage";
import CoachProfile from "./pages/coach-pages/profile/CoachProfile";
import CoachMainPage from "./pages/coach-pages/main/CoachMainPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/coach/main" element={<CoachMainPage />} />
        <Route path="/coach/students" element={<StudentsPage />} />
        <Route path="/coach/management" element={<ManagementPage />} />
        <Route path="/coach/profile" element={<CoachProfile />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/club-page" element={<ClubPage />} />
        <Route path="/main" element={<MainPage2 />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/trainings" element={<TrainingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* catch-all */}
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </Router>
  );
}
