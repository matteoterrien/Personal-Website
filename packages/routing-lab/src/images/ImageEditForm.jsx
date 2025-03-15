import { useState } from "react";

export function ImageEditForm() {
  const [imageId, setImageId] = useState("");
  const [imageName, setImageName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    // Add your fetch code here...
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: imageName,
        }),
      });
      if (!response.ok) {
        console.log(imageId, imageName);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setImageId("");
      setImageName("");
      setIsLoading(false);
    }
  }

  return (
    <div>
      <label style={{ display: "block" }}>
        Image ID
        <input
          value={imageId}
          disabled={isLoading}
          onChange={(e) => setImageId(e.target.value)}
        />
      </label>
      <label style={{ display: "block" }}>
        New image name
        <input
          value={imageName}
          disabled={isLoading}
          onChange={(e) => setImageName(e.target.value)}
        />
      </label>
      <button disabled={isLoading} onClick={handleSubmit}>
        Send request
      </button>
    </div>
  );
}
