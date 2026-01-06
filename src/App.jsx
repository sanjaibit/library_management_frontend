import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Explore from "./pages/Explore";
import LearningCentre from "./pages/LearningCentre";
import Profile from "./pages/Profile";
import AdminDashboard from "./admin/AdminDashboard";
import StaffDashboard from "./staff/StaffDashboard";
import LibraryStaffDashboard from "./staff/LibraryStaffDashboard";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute role="USER" />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LearningCentre />} />
              <Route path="explore" element={<Explore />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute role="ADMIN" />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute role="STAFF" />}>
            <Route path="/staff" element={<StaffDashboard />} />
          </Route>
          <Route element={<ProtectedRoute role="LIB_STAFF" />}>
            <Route path="/library-staff" element={<LibraryStaffDashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
