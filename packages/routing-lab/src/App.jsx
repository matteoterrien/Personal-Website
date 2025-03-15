import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { MainLayout } from "./MainLayout.jsx";
import { useImageFetching } from "./images/useImageFetching.js";
import RegisterPage from "./auth/RegisterPage";
import LoginPage from "./auth/LoginPage";
import { ProtectedRoute } from "./auth/ProtectedRoute.jsx";

function App() {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(null);
  const [username, setUsername] = useState("John Doe");
  const { isLoading, fetchedImages } = useImageFetching("", authToken);

  function handleLogin(token) {
    setAuthToken(token);
    navigate("/");
  }

  const changeUsername = (e) => {
    setUsername(e.target.value);
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/register"
          element={<RegisterPage onLogin={handleLogin} />}
        />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute authToken={authToken}>
              <Homepage userName={username} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute authToken={authToken}>
              <AccountSettings changeUsername={changeUsername} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/images"
          element={
            <ProtectedRoute authToken={authToken}>
              <ImageGallery
                isLoading={isLoading}
                fetchedImages={fetchedImages}
                authToken={authToken}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/images/:imageId"
          element={
            <ProtectedRoute authToken={authToken}>
              <ImageDetails />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
