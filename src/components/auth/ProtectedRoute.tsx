import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Якщо не залогінений, перенаправляємо на логін
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}
