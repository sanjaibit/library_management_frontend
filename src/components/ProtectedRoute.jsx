import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ role }) {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && !user.roles?.includes(`ROLE_${role}`)) {
    if (user.roles?.includes("ROLE_ADMIN")) {
      return <Navigate to="/admin" replace />;
    } else if (user.roles?.includes("ROLE_STAFF")) {
      return <Navigate to="/staff" replace />;
    } else if (user.roles?.includes("ROLE_LIB_STAFF")) {
      return <Navigate to="/library-staff" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
