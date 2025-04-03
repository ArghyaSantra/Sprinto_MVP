import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await login({ variables: { email, password } });
    if (res.data?.login?.token) {
      localStorage.setItem("token", res.data.login.token);
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="text-red-500">Error: {error.message}</p>}
      </form>
    </div>
  );
}
