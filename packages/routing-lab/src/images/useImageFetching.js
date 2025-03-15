import { useEffect, useState } from "react";

/**
 * Fetches images on component mount.  Returns an object with two properties: isLoading and fetchedImages, which will be
 * an array of ImageData
 *
 * @param imageId {string} the image ID to fetch, or all of them if empty string
 * @param delay {number} the number of milliseconds fetching will take
 * @returns {{isLoading: boolean, fetchedImages: ImageData[]}} fetch state and data
 */

export function useImageFetching(imageId, authToken, delay = 1000) {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedImages, setFetchedImages] = useState([]);

  async function fetchImages() {
    try {
      const response = await fetch("/api/images", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.status}`);
      }

      const data = await response.json();

      setFetchedImages(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (authToken) {
      fetchImages();
    } else {
      setIsLoading(false);
    }
  }, [imageId, authToken]);

  return { isLoading, fetchedImages };
}
