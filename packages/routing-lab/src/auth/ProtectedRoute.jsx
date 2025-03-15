import { Navigate } from "react-router";

export function ProtectedRoute(props) {
  if (!props.authToken) {
    return <Navigate to="/login" replace />;
  }

  return props.children;
}
