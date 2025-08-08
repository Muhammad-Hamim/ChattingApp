import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/Alert";
import { deleteUserAccount, logoutUser } from "@/services/authService";
import {
  clearAuth,
  clearError,
  setError,
  setUser,
} from "@/redux/auth/authSlice";
import type { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { auth } from "@/config/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useRegistrationMutation } from "@/redux/auth/authApi";
import type { TUserData } from "@/types/auth";

const VerifyEmail = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const { user, error } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get registration mutation but don't destructure to avoid automatic error handling
  const [registration] = useRegistrationMutation();

  // Clear any existing errors when component mounts
  useEffect(() => {
    dispatch(clearError());
    console.log(
      "VerifyEmail mounted - User:",
      user,
      "Firebase user:",
      auth.currentUser
    );
  }, [dispatch, user]);

  // Get current user from Firebase if Redux user is not available
  const currentUser = user || auth.currentUser;
  const userEmail = currentUser?.email || user?.email;

  // If no user is found, redirect to login
  if (!currentUser && !user) {
    navigate("/login");
    return null;
  }

  const handleCheckVerification = async () => {
    setIsChecking(true);
    dispatch(clearError());
    const user = auth.currentUser;
    try {
      if (user) {
        // Reload user data from Firebase to get latest verification status
        await user.reload();

        if (user.emailVerified) {
          // Only register on server if email is verified
          const userData: TUserData = {
            email: user.email as string,
            name: user.displayName as string,
            lastLogin: new Date(),
            uid: user.uid,
          };

          try {
            const response = await registration({ userData }).unwrap();
            if (!response.data._id) {
              await deleteUserAccount(user.uid);
              dispatch(
                setError("Failed to create user account. Please try again.")
              );
              navigate("/register");
              return;
            }

            dispatch(
              setUser({
                uid: user.uid,
                email: user.email!,
                name: user.displayName,
                emailVerified: user.emailVerified,
              })
            );

            // Show success message before redirect
            setResendSuccess(true);
            setTimeout(() => {
              navigate("/dashboard");
            }, 1000);
          } catch (serverError) {
            console.error("Server registration error:", serverError);
            dispatch(
              setError(
                `Registration failed: ${
                  serverError instanceof Error
                    ? serverError.message
                    : "Server error"
                }`
              )
            );
          }
        } else {
          dispatch(
            setError(
              "Email not verified yet. Please check your email and click the verification link, then try again."
            )
          );
        }
      } else {
        dispatch(setError("No user found. Please try logging in again."));
      }
    } catch (error) {
      console.error("Verification check error:", error);
      dispatch(
        setError(
          `Failed to check verification status: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        )
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    dispatch(setError(null));

    try {
      // Import sendEmailVerification dynamically to avoid issues
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch {
      dispatch(
        setError("Failed to resend verification email. Please try again.")
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearAuth());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const openGmail = () => {
    window.open("https://mail.google.com", "_blank", "noopener,noreferrer");
  };

  const openYahoo = () => {
    window.open("https://mail.yahoo.com", "_blank", "noopener,noreferrer");
  };

  const openOutlook = () => {
    window.open("https://outlook.live.com", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Email Icon */}
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification link to
          </p>
          <p className="font-medium text-blue-600">{userEmail}</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          {resendSuccess && (
            <div className="mb-4">
              <Alert variant="success">
                {isChecking
                  ? "Email verified successfully! Redirecting to dashboard..."
                  : "Verification email sent successfully! Check your inbox."}
              </Alert>
            </div>
          )}

          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Verify your email
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                After clicking the verification link in your email, click the
                button below
              </p>

              <Button
                onClick={handleCheckVerification}
                disabled={isChecking}
                className="w-full mb-4"
              >
                {isChecking
                  ? "Checking verification..."
                  : "✓ I've verified my email"}
              </Button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <Button
                onClick={handleResendVerification}
                variant="outline"
                disabled={isResending}
                className="w-full mb-4"
              >
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Quick access to your inbox
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                onClick={openGmail}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                <span>Open Gmail</span>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={openYahoo}
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center space-x-1"
                >
                  <span className="text-purple-600 font-bold">Y!</span>
                  <span>Yahoo</span>
                </Button>

                <Button
                  onClick={openOutlook}
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center space-x-1"
                >
                  <span className="text-blue-600 font-bold">⊞</span>
                  <span>Outlook</span>
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 mb-4">
                Click the verification link in your email first, then use the
                verification button above.
              </p>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                Sign out and use different email
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            📧 What to do next:
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Check your email inbox for our verification message</li>
            <li>• Look in spam/junk folder if you don't see it</li>
            <li>• Click the verification link in the email</li>
            <li>• Return to this page and click "✓ I've verified my email"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
