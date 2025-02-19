import { useState } from "react";
import Todo from "./components/Todo";
import AddTaskForm from "./components/AddTaskForm";
import { nanoid } from "nanoid";
import Modal from "./components/Modal";
import { GroceryPanel } from "./components/GroceryPanel";

const INITIAL_TASK_LIST = [
  { id: nanoid(), name: "Eat", completed: false },
  { id: nanoid(), name: "Sleep", completed: false },
  { id: nanoid(), name: "Repeat", completed: false },
];

function App() {
  const [tasks, setTasks] = useState(INITIAL_TASK_LIST);
  const [modal, setModal] = useState(false);

  function addTask(task) {
    let newTask = { id: nanoid(), name: task, completed: false };
    const newTaskList = [...tasks, newTask];
    setTasks(newTaskList);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  }

  function toggleModal() {
    setModal(!modal);
  }

  return (
    <main className="m-4">
      <section className="flex flex-col gap-2">
        {modal ? (
          <Modal headerLabel={"New Task"} onCloseRequested={toggleModal}>
            <AddTaskForm onNewTask={addTask} onCloseRequested={toggleModal} />
          </Modal>
        ) : null}
        <button
          className="flex flex-row justify-center w-24 p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          onClick={toggleModal}
        >
          New Task
        </button>
        <h1 className="text-xl font-bold">To do</h1>
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <Todo
              key={task.id}
              id={task.id}
              name={task.name}
              completed={task.completed}
              toggle={toggleTaskCompleted}
              delete={deleteTask}
            />
          ))}
        </ul>
        <br className="m-2" />
        <GroceryPanel onNewTask={addTask} />
      </section>
    </main>
  );
}

export default App;
