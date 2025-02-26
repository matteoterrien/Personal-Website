import React from "react";
import { useState, useEffect } from "react";
import { Spinner } from "./Spinner";
import { groceryFetcher } from "./groceryFetcher";

const MDN_URL =
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json";

/**
 * Creates and returns a new promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms the number of milliseconds to delay
 * @returns {Promise<undefined>} a promise that resolves with the value of `undefined` after the specified delay
 */
function delayMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function GroceryPanel(props) {
  const [groceryData, setGroceryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdown, setDropdown] = useState("MDN");

  let isStale = false;

  async function fetchData(name) {
    setGroceryData([]);
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
  }

  useEffect(() => {
    fetchData(dropdown);

    return () => {
      isStale = false;
    };
  }, [dropdown]);

  function handleAddTodoClicked(item) {
    const todoName = `Buy ${item.name} (${item.price.toFixed(2)})`;
    props.onNewTask(todoName);
  }

  function handleDropdownChange(changeEvent) {
    if (changeEvent.target.value === "") {
      setGroceryData([]);
      setError(null);
      return;
    }

    setDropdown(changeEvent.target.value);
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Groceries prices today</h1>
      <label className="mb-4 flex gap-4 items-center">
        Get prices from:
        <select
          className="border border-gray-300 p-1 rounded-sm disabled:opacity-50"
          disabled={isLoading}
          onChange={handleDropdownChange}
          value={dropdown}
        >
          <option value="MDN">MDN</option>
          <option value="Liquor store">Liquor store</option>
          <option value="Butcher">Butcher</option>
          <option value="whoknows">Who knows?</option>
        </select>
        {isLoading ? <Spinner /> : null}
        {error ? <p className="text-red-500 text-sm">{error}</p> : null}
      </label>

      {groceryData.length > 0 ? (
        <PriceTable items={groceryData} onAddClicked={handleAddTodoClicked} />
      ) : (
        "No data"
      )}
    </div>
  );
}

function PriceTable(props) {
  return (
    <table className="mt-4">
      <thead>
        <tr>
          <th className="text-left">Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {props.items.map((item) => (
          <PriceTableRow
            key={item.name}
            item={item}
            onAddClicked={() => props.onAddClicked(item)}
          />
        ))}
      </tbody>
    </table>
  );
}

function PriceTableRow({ item, onAddClicked }) {
  const buttonClasses = `italic px-2 rounded-sm border border-gray-300
        hover:bg-gray-100 active:bg-gray-200 cursor-pointer`;
  return (
    <tr>
      <td>{item.name}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>
        <button className={buttonClasses} onClick={onAddClicked}>
          Add to todos
        </button>
      </td>
    </tr>
  );
}
