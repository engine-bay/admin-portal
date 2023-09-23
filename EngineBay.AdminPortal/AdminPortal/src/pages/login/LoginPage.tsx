import { FormEvent, useState } from "react";
import { useLogin, useNotify } from "react-admin";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // will call authProvider.login({ username, password })
    login({ username, password }).catch(() => notify("Invalid username or password"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </form>
  );
};
