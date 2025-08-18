import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { FaUserCircle } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Logged in successfully!");
        navigate("/home");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch {
      setMessage("Something went wrong");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "1rem"
    }}>
      <div style={{
        background: "white",
        padding: "2.5rem 3rem",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: 420,
        textAlign: "center",
        position: "relative"
      }}>
        <FaUserCircle style={{ fontSize: 60, color: "#2563eb", marginBottom: 16 }} />
        <h2 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#111827" }}>
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
            onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = "#2563eb"}
            onBlur={(e) => e.currentTarget.style.borderColor = "#d1d5db"}
          />

          <button
            type="submit"
            style={{
              padding: "0.75rem 1rem",
              background: "linear-gradient(90deg, #2563eb, #1e40af)",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Log In
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: "1rem",
            color: message.includes("success") ? "green" : "red",
            textAlign: "center",
            fontWeight: 500
          }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "#6b7280" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
