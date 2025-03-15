import React from "react";
import UsernamePasswordForm from "./UsernamePasswordForm";
import { sendPostRequest } from "./sendPostRequest";

export default function RegisterPage() {
  async function handleRegister({ username, password }) {
    console.log("Registering user:", username, password);

    const response = await sendPostRequest("/auth/register", {
      username,
      password,
    });

    if (response.status === 201) {
      const { token } = response;
      console.log("Extracted Token:", token);

      onLogin(token);

      return { type: "success", message: "Registration successful!" };
    } else if (response.status === 400) {
      return {
        type: "error",
        message: "User already exists. Please try another username.",
      };
    } else {
      return {
        type: "error",
        message: "An unexpected error occurred. Please try again later.",
      };
    }
  }

  return (
    <div>
      <h2>Register a New Account</h2>
      <UsernamePasswordForm onSubmit={handleRegister} />
    </div>
  );
}
