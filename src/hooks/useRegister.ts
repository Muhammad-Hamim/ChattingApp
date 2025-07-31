// useRegister.ts
import { useState } from "react";
import { registerUser } from "@/services/authService";
import { useAppDispatch } from "@/redux/hooks";
import {
  setUser,
  setLoading,
  setError,
  clearError,
} from "@/redux/auth/authSlice";

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export const useRegister = () => {
  const [success, setSuccess] = useState(false);
  const dispatch = useAppDispatch();

  const registerNewUser = async (data: RegisterFormData) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      const user = await registerUser(data);
      if (!user) throw new Error("Failed to create user in Firebase");

      console.log("Firebase user created:", user);

      // Set user in Redux state so it's available in VerifyEmail component
      dispatch(setUser(user));
      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      dispatch(setError(message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return { registerNewUser, success };
};
