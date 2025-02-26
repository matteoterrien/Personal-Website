import { useState, useEffect } from "react";
import { groceryFetcher } from "./groceryFetcher";

export function useGroceryFetch(source) {
  const [groceryData, setGroceryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Creates and returns a new promise that resolves after a specified number of milliseconds.
   *
   * @param {number} ms the number of milliseconds to delay
   * @returns {Promise<undefined>} a promise that resolves with the value of `undefined` after the specified delay
   */
  function delayMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let isStale = false;

  async function fetchData(name) {
    setIsLoading(true);
    setGroceryData([]);

    if (name === "") {
      setError(null);
      setIsLoading(false);
      return;
    }

    await delayMs(2000);
    try {
      const data = await groceryFetcher.fetch(name);

      if (!isStale) {
        setGroceryData(data);
        setError(null);
      }
    } catch (error) {
      if (!isStale) {
        setError("Error fetching data.");
      }
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData(source);

    return () => {
      isStale = false;
    };
  }, [source]);

  return { groceryData, isLoading, error };
}
