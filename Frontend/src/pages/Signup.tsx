import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(data.message || "Signup failed");
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
      background: "#f3f4f6",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "1rem"
    }}>
      <div style={{
        background: "white",
        padding: "2rem 3rem",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: 400
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#111827" }}>Sign Up</h2>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            required
            onChange={(e) => setFirstName(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 4,
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none"
            }}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            required
            onChange={(e) => setLastName(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 4,
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none"
            }}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            required
            onChange={(e) => setPhone(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 4,
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none"
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 4,
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none"
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 4,
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none"
            }}
          />

          <button
            type="submit"
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1e40af")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2563eb")}
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p style={{ marginTop: "1rem", color: message.toLowerCase().includes("success") ? "green" : "red", textAlign: "center" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "#6b7280" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
