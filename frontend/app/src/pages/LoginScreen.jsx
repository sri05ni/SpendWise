

import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import API from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
// import "./Auth.css";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        const response = await API.post("/api/auth/login", {
            email: email.trim().toLowerCase(),
            password,
        });

        const data = response.data;

        // Save JWT
        sessionStorage.setItem("token", data.token);

        // Save user details
        sessionStorage.setItem("user", JSON.stringify(data.user));

        // Navigate to Dashboard
        navigate("/dashboard");
    } catch (error) {
        setError(
            error.response?.data?.message || "Unable to login"
        );
    } finally {
        setLoading(false);
    }
};
  return (
    <div className="auth-page">

      {/* LEFT SIDE - IMAGE & BRANDING */}
      <div className="auth-visual">

        <div className="auth-brand">
          <h1>💰 SpendWise</h1>
          <p>Your Money. Your Control.</p>
        </div>

        <div className="auth-illustration">
          <img
            src="/images/banner3.jpg"
            alt="Personal finance management"
          />
        </div>

        <div className="auth-message">
          <h2>Manage money.<br />Build your future.</h2>

          <p>
            Track your income, manage expenses, and make
            smarter financial decisions every day.
          </p>

          <div className="auth-features">
            <span>✓ Track income</span>
            <span>✓ Manage expenses</span>
            <span>✓ Monitor savings</span>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="auth-form-section ">

        <div className="auth-card bg-secondary">

          <div className="auth-heading">
            <h2>Login</h2>
            <p className="text-light">Welcome back! Login to your account.</p>
          </div>

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>

            {/* EMAIL */}
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>

              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            {/* PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>

              <InputGroup>
                <Form.Control
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="pass1"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <InputGroup.Text
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="password-toggle"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            {/* LOGIN BUTTON */}
            <Button
              type="submit"
              className="auth-submit-btn w-100 mt-3"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

          </Form>

          <div className="auth-divider text-dark">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup">Sign Up</Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default LoginScreen;
