import { BrowserRouter, Routes, Route } from "react-router";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { AuthGuard } from "@/components/AuthGuard";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import VerifyEmail from "@/pages/VerifyEmail";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <AuthGuard requireAuth={false}>
                <HomePage />
              </AuthGuard>
            }
          />
          <Route
            path="/login"
            element={
              <AuthGuard requireAuth={false}>
                <LoginPage />
              </AuthGuard>
            }
          />
          <Route
            path="/register"
            element={
              <AuthGuard requireAuth={false}>
                <RegisterPage />
              </AuthGuard>
            }
          />

          {/* Email verification route */}
          <Route
            path="/verify-email"
            element={
              <AuthGuard requireAuth={true}>
                <VerifyEmail />
              </AuthGuard>
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard requireAuth={true}>
                <DashboardPage />
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
