export function AccountSettings(props) {
  return (
    <div>
      <h2>Account settings</h2>
      <label>
        Username <input onChange={props.changeUsername} />
      </label>
      <p>
        <i>Changes are auto-saved.</i>
      </p>
    </div>
  );
}
