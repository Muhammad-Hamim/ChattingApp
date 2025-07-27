import { Button } from "@/components/ui/Button";
import { logoutUser } from "@/services/authService";
import { clearAuth } from "@/redux/auth/authSlice";
import { useNavigate } from "react-router";
import type { RootState } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export const DashboardPage = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearAuth());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Chatting App
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user?.displayName || user?.email}
              </span>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dashboard
              </h2>
              <p className="text-gray-600 mb-6">
                Welcome to your dashboard! You have successfully logged in.
              </p>

              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Your Profile
                </h3>
                <div className="space-y-2 text-left">
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Display Name:</strong>{" "}
                    {user?.displayName || "Not set"}
                  </p>
                  <p>
                    <strong>Email Verified:</strong>{" "}
                    {user?.emailVerified ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>User ID:</strong> {user?.uid}
                  </p>
                </div>
              </div>

              {!user?.emailVerified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800">
                    Please check your email and verify your account for full
                    access.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
