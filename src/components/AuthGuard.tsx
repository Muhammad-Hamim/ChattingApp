import { useEffect } from "react";
import { useNavigate } from "react-router";
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
        navigate("/dashboard");
      } else if (user && !user.emailVerified) {
        navigate("/verify-email");
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate, requireAuth]);

  return <>{children}</>;
};
