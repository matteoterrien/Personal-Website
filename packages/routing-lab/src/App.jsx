import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { Routes, Route } from "react-router";
import { useState } from "react";
import { MainLayout } from "./MainLayout.jsx";
import { useImageFetching } from "./images/useImageFetching.js";

function App() {
  const [username, setUsername] = useState("John Doe");
  const { isLoading, fetchedImages } = useImageFetching("");

  const changeUsername = (e) => {
    setUsername(e.target.value);
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Homepage userName={username} />} />
        <Route
          path="/account"
          element={<AccountSettings changeUsername={changeUsername} />}
        />
        <Route
          path="/images"
          element={
            <ImageGallery isLoading={isLoading} fetchedImages={fetchedImages} />
          }
        />
        <Route path="/images/:imageId" element={<ImageDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
