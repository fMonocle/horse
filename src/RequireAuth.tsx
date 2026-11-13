import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth";

export function RequireAuth() {
  const { signedIn } = useAuth();
  if (!signedIn) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
