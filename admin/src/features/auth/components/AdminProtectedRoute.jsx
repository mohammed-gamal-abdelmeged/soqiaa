import {
  Navigate,
  useLocation,
} from "react-router-dom";

import {
  useAdminAuth,
} from "../context/useAdminAuth";

function AdminProtectedRoute({
  children,
}) {
  const {
    isAuthenticated,
    isAuthLoading,
  } = useAdminAuth();

  const location =
    useLocation();

  if (isAuthLoading) {
    return (
      <div
        className="
          flex min-h-screen
          items-center
          justify-center
        "
      >
        <span
          className="
            h-8 w-8
            animate-spin
            rounded-full
            border-2
            border-gray-200
            border-t-secondary
          "
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return children;
}

export default AdminProtectedRoute;