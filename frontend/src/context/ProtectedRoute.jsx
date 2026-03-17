import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";
import useAuth from "./useAuth";

/**
 * Usage:
 *   <ProtectedRoute>                              → any logged-in user
 *   <ProtectedRoute roles={["ADMIN"]}>            → ADMIN only
 *   <ProtectedRoute roles={["ADMIN","COUNSELOR"]}> → multiple roles
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to their own dashboard if wrong role
    const roleRoute = user.role.toLowerCase();
    return <Navigate to={`/${roleRoute}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
