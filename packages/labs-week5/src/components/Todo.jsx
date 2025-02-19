import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Todo(props) {
  return (
    <li className="flex-row space-x-4">
      <label>
        <input
          id={props.id}
          type="checkbox"
          checked={props.completed}
          onChange={() => props.toggle(props.id)}
        />{" "}
        {props.name}
      </label>
      <button
        className="text-stone-400 hover:text-stone-600 active:text-stone-800"
        onClick={() => props.delete(props.id)}
      >
        <FontAwesomeIcon icon={faTrash} title="delete" />
      </button>
    </li>
  );
}

export default Todo;
