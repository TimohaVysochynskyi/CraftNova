import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

interface ProtectedGuestRouteProps {
  children: React.ReactNode;
}

export default function ProtectedGuestRoute({
  children,
}: ProtectedGuestRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Якщо користувач залогінений, перенаправляємо на dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
