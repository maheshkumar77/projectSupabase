"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "../../../action/auth";
import "./style.css"

export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword ||
      !form.role
    ) {
      setMessage("❌ Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match.");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const result = await signUp(form);

      if (result.status === "success") {
        setMessage("✅ Signup successful! Please check your email to confirm.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError("Signup failed. Try again.");
      }
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-header">
          <h2>Create Your Account</h2>
          <p>Join our educational community today</p>
        </div>

        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder=" "
            value={form.username}
            onChange={handleChange}
            className="form-input"
          />
          <label className="input-label">Username</label>
          <span className="input-highlight"></span>
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder=" "
            value={form.email}
            onChange={handleChange}
            className="form-input"
          />
          <label className="input-label">Email Address</label>
          <span className="input-highlight"></span>
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder=" "
            value={form.password}
            onChange={handleChange}
            className="form-input"
          />
          <label className="input-label">Password</label>
          <span className="input-highlight"></span>
        </div>

        <div className="input-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder=" "
            value={form.confirmPassword}
            onChange={handleChange}
            className="form-input"
          />
          <label className="input-label">Confirm Password</label>
          <span className="input-highlight"></span>
        </div>

        <div className="role-selection">
          <h3>Select Your Role</h3>
          <div className="role-options">
            <label className={`role-card ${form.role === "student" ? "selected" : ""}`}>
              <input
                type="radio"
                name="role"
                value="student"
                checked={form.role === "student"}
                onChange={handleChange}
                className="role-input"
              />
              <div className="role-content">
                <div className="role-icon">🎓</div>
                <span>Student</span>
              </div>
            </label>

            <label className={`role-card ${form.role === "teacher" ? "selected" : ""}`}>
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={form.role === "teacher"}
                onChange={handleChange}
                className="role-input"
              />
              <div className="role-content">
                <div className="role-icon">👨‍🏫</div>
                <span>Teacher</span>
              </div>
            </label>

            <label className={`role-card ${form.role === "headteacher" ? "selected" : ""}`}>
              <input
                type="radio"
                name="role"
                value="headteacher"
                checked={form.role === "headteacher"}
                onChange={handleChange}
                className="role-input"
              />
              <div className="role-content">
                <div className="role-icon">👨‍💼</div>
                <span>Headteacher</span>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`signup-button ${loading ? "loading" : ""}`}
        >
          <span className="button-text">
            {loading ? "Creating Account..." : "Sign Up"}
          </span>
          <div className="button-loader"></div>
        </button>

        {error && (
          <div className="message error-message animate-shake">
            <span className="message-icon">⚠️</span>
            {error}
          </div>
        )}
        
        {message && (
          <div className={`message ${message.includes("❌") ? "error-message" : "success-message"} animate-fadeIn`}>
            <span className="message-icon">
              {message.includes("❌") ? "⚠️" : "✅"}
            </span>
            {message.replace("❌", "").replace("✅", "")}
          </div>
        )}

        <p className="login-redirect">
          Already have an account?{" "}
          <a href="/login" className="login-link">Log in here</a>
        </p>
      </form>
    </div>
  );
}