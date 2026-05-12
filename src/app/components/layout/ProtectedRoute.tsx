import { Navigate, Outlet, useLocation } from "react-router";
import { useApp } from "../../context/AppContext";
import { Role } from "../../data/domain";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser, isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
