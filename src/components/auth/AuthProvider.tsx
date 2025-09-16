import { useEffect } from "react";
import { useAppDispatch, useIsAuthenticated } from "../../redux/hooks";
import { refreshTokens } from "../../redux/slices/authSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    // Check if user has refresh token on app start
    const initializeAuth = async () => {
      if (!isAuthenticated) {
        // Get refresh token from localStorage
        const persistedState = localStorage.getItem("persist:root");
        if (persistedState) {
          try {
            const parsedState = JSON.parse(persistedState);
            const authState = JSON.parse(parsedState.auth);

            if (authState.refreshToken) {
              // Try to refresh tokens to validate session
              await dispatch(refreshTokens(authState.refreshToken));
            }
          } catch (error) {
            console.error("Error initializing auth:", error);
          }
        }
      }
    };

    initializeAuth();
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
}
