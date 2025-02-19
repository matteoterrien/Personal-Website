import { useState } from "react";

function AddTaskForm(props) {
  const [inputField, setInputField] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    props.onNewTask(inputField);
    setInputField("");
    props.onCloseRequested();
  }

  function handleChange(event) {
    setInputField(event.target.value);
  }

  return (
    <div className="flex space-x-4 my-4 items-center">
      <input
        className="border-2 rounded-lg p-3"
        placeholder="New task name"
        value={inputField}
        onChange={handleChange}
      />
      <button
        className="p-2 h-9/10 rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        onClick={handleSubmit}
      >
        Add Task
      </button>
    </div>
  );
}

export default AddTaskForm;
