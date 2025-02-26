import React from "react";
import { useState } from "react";
import { Spinner } from "./Spinner";
import { useGroceryFetch } from "./useGroceryFetch";

const MDN_URL =
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json";

export function GroceryPanel(props) {
  const [dropdown, setDropdown] = useState("MDN");

  const { groceryData, isLoading, error } = useGroceryFetch(dropdown);

  function handleAddTodoClicked(item) {
    const todoName = `Buy ${item.name} (${item.price.toFixed(2)})`;
    props.onNewTask(todoName);
  }

  function handleDropdownChange(changeEvent) {
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
