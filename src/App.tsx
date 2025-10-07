import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import AuthProvider from "./components/auth/AuthProvider";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage/AuthPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage/DashboardPage"));
const ApplicationPage = lazy(
  () => import("./pages/ApplicationPage/ApplicationPage")
);
const AdminApplicationsPage = lazy(
  () => import("./pages/AdminApplicationsPage/AdminApplicationsPage")
);
const AdminApplicationDetailPage = lazy(
  () => import("./pages/AdminApplicationDetailPage/AdminApplicationDetailPage")
);
const AdminUsersPage = lazy(
  () => import("./pages/AdminUsersPage/AdminUsersPage")
);

// Components
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const ProtectedAdminRoute = lazy(
  () => import("./components/admin/ProtectedAdminRoute")
);
const ProtectedGuestRoute = lazy(
  () => import("./components/auth/ProtectedGuestRoute")
);
const ProtectedRoute = lazy(() => import("./components/auth/ProtectedRoute"));
const ProtectedApplicationRoute = lazy(
  () => import("./components/application/ProtectedApplicationRoute")
);

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/application"
              element={
                <ProtectedApplicationRoute>
                  <ApplicationPage />
                </ProtectedApplicationRoute>
              }
            />
            <Route
              path="/auth/login"
              element={
                <ProtectedGuestRoute>
                  <AuthPage />
                </ProtectedGuestRoute>
              }
            />
            <Route
              path="/auth/register"
              element={
                <ProtectedGuestRoute>
                  <AuthPage />
                </ProtectedGuestRoute>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route path="applications" element={<AdminApplicationsPage />} />
            <Route
              path="applications/:id"
              element={<AdminApplicationDetailPage />}
            />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
