
import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../services/api";
// import "./Auth.css";

function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    // Check password match
    if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    // Check password length
    if (password.length < 6) {
        setError("Password must contain at least 6 characters");
        return;
    }

    setLoading(true);

    try {
        const response = await API.post("/api/auth/signup", {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
        });

        const data = response.data;

        // Store token
        sessionStorage.setItem("token", data.token);

        // Store user details
        sessionStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to Dashboard
        navigate("/dashboard");

    } catch (err) {
        setError(
            err.response?.data?.message || "Something went wrong"
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
            src="/images/banner5.webp"
            alt="Personal finance management"
          />
        </div>

        <div className="auth-message">
          <h2>Start your financial journey.</h2>

          <p>
            Create your account and take control of your income,
            expenses, savings, and financial goals.
          </p>

          <div className="auth-features">
            <span>✓ Track income</span>
            <span>✓ Manage expenses</span>
            <span>✓ Monitor savings</span>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE - SIGNUP FORM */}
      <div className="auth-form-section">

        <div className="auth-card bg-secondary">

          <div className="auth-heading">
            <h2>Create Account</h2>

            <p className="text-primary">
              Join SpendWise and manage your expenses smarter.
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSignup}>

            {/* FULL NAME */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

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
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />

                <InputGroup.Text
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </InputGroup.Text>
              </InputGroup>

              <Form.Text className="text-muted">
                Password must contain at least 6 characters.
              </Form.Text>
            </Form.Group>

            {/* CONFIRM PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>

              <InputGroup>
                <Form.Control
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />

                <InputGroup.Text
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                >
                  {showConfirmPassword ? (
                    <FaEye />
                  ) : (
                    <FaEyeSlash />
                  )}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            {/* SIGNUP BUTTON */}
            <Button
              type="submit"
              className="auth-submit-btn w-100 mt-2"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>

          </Form>

          {/* DIVIDER */}
          <div className="auth-divider text-dark">
            <span>OR</span>
          </div>

          {/* LOGIN LINK */}
          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default SignupScreen;
