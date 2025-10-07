import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getMyApplication } from "../../redux/slices/applicationSlice";

interface ProtectedApplicationRouteProps {
  children: React.ReactNode;
}

export default function ProtectedApplicationRoute({
  children,
}: ProtectedApplicationRouteProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { application, isLoading } = useAppSelector(
    (state) => state.application
  );

  useEffect(() => {
    // Завантажуємо анкету при монтуванні компонента
    if (isAuthenticated) {
      dispatch(getMyApplication());
    }
  }, [dispatch, isAuthenticated]);

  // Якщо не залогінений, перенаправляємо на логін
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Показуємо завантаження поки перевіряємо анкету
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Завантаження...
      </div>
    );
  }

  // Якщо вже є анкета (pending або approved), перенаправляємо на dashboard
  if (
    application &&
    (application.status === "pending" || application.status === "approved")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
