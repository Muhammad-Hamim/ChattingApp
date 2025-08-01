import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { onAuthStateChange } from "@/services/authService";
import { setUser, setLoading } from "@/redux/auth/authSlice";
import type { ReactNode } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { auth } from "@/config/firebase";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = () => {
    const accessToken = auth.currentUser;
    return accessToken;
  };

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChange((user) => {
      dispatch(setUser(user));
      dispatch(setLoading(false));
      console.log("Auth Guard - Access Token:", accessToken());

      if (requireAuth && !user) {
        navigate("/login");
      } else if (user && user.emailVerified) {
        // Only navigate to dashboard if user is on a public route or root
        const currentPath = location.pathname;
        const publicRoutes = ["/", "/login", "/register"];

        if (publicRoutes.includes(currentPath)) {
          navigate("/dashboard");
        }
        // Don't redirect if user is already on a protected route like /dashboard/chat/123
      } else if (user && !user.emailVerified) {
        navigate("/verify-email");
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate, requireAuth, location.pathname]);

  return <>{children}</>;
};
