import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicOnlyRoute() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

export default PublicOnlyRoute;