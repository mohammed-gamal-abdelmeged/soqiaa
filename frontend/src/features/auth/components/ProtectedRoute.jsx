import {
  Navigate,
  useLocation,
} from "react-router-dom";

import ProtectedRouteSkeleton from "../../../components/loaders/ProtectedRouteSkeleton";

import {
  useAuth,
} from "../context/useAuth";

function ProtectedRoute({
  children,
}) {
  const {
    isAuthenticated,
    isAuthLoading,
  } = useAuth();

  const location =
    useLocation();

  if (isAuthLoading) {
    return (
      <ProtectedRouteSkeleton />
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

export default ProtectedRoute;