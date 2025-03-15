import React, { useActionState, useState } from "react";

export default function UsernamePasswordForm({ onSubmit }) {
  const [error, setError] = useState(false);
  const [result, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const username = formData.get("username");
      const password = formData.get("password");

      if (!username || !password) {
        return {
          type: "error",
          message: `Please fill in your username and password.`,
        };
      }

      const submitResult = await onSubmit({ username, password });
      return submitResult;
    }
  );
  return (
    <>
      {result && <p className={`message ${result.type}`}>{result.message}</p>}
      {isPending && <p className="message loading">Loading ...</p>}
      <form action={submitAction}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            disabled={isPending}
          />
        </div>
        <button type="submit" disabled={isPending}>
          Submit
        </button>
      </form>
      {result?.type === "error" && (
        <p style={{ color: "red", fontWeight: "bold" }}>{result.message}</p>
      )}
    </>
  );
}
