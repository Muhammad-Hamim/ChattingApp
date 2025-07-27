import { useEffect } from "react";
import { useNavigate } from "react-router";
import { onAuthStateChange } from "@/services/authService";
import { setUser, setLoading } from "@/redux/auth/authSlice";
import type { ReactNode } from "react";
import { useAppDispatch } from "@/redux/hooks";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChange((user) => {
      dispatch(setUser(user));
      dispatch(setLoading(false));
      if (requireAuth && !user) {
        navigate("/login");
      } else if(user && user.emailVerified) {
        navigate("/dashboard");
      } else if(user && !user.emailVerified){
        navigate("/verify-email");
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate, requireAuth]);


  return <>{children}</>;
};
