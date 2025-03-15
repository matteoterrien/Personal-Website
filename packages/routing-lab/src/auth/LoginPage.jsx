import React from "react";
import { useNavigate } from "react-router";
import UsernamePasswordForm from "./UsernamePasswordForm";
import { sendPostRequest } from "./sendPostRequest";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  async function handleLogin({ username, password }) {
    const response = await sendPostRequest("/auth/login", {
      username,
      password,
    });

    if (response.status === 200) {
      const { token } = response;
      console.log("Authentication Token:", token);

      onLogin(token);
      navigate("/");

      return { type: "success", message: "Login successful!" };
    } else if (response.status === 401) {
      return { type: "error", message: "Incorrect username or password." };
    } else {
      return {
        type: "error",
        message: "An unexpected error occurred. Please try again later.",
      };
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <UsernamePasswordForm onSubmit={handleLogin} />
    </div>
  );
}
