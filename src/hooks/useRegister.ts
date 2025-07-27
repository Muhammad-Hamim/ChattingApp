// useRegister.ts
import { useState } from "react";
import { registerUser } from "@/services/authService";
import { useAppDispatch } from "@/redux/hooks";
import {
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
  const [success] = useState(false);
  const dispatch = useAppDispatch();
  const registerNewUser = async (data: RegisterFormData) => {
    dispatch(setLoading(true));
    dispatch(clearError());
    try {
      const user = await registerUser(data);
      if (!user) throw new Error("Failed to create user in Firebase");
        console.log('user has been created', user);
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
