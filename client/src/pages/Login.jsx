import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(form);
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-card">
          <p className="auth-label">Welcome back</p>
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button type="submit">Log In</button>
          </form>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-content">
          <h2>Hello Again!</h2>
          <p>Don’t have an account?</p>
          <button onClick={() => navigate("/register")}>SIGN UP</button>
        </div>
      </div>
    </div>
  );
}