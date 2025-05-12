import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // now holds string messages

  const RESPONSE_STATUS = {
    FAIL: false,
    SUCCESS: true,
  };

 const submit = async () => {
  try {
    if (email.length === 0 || password.length === 0) {
      setError("Please enter both email and password.");
      return;
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const body = { email, password };
    const result = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const bodyPar = await result.json();
    console.log(bodyPar, "bodyPar");

    if (bodyPar?.status === RESPONSE_STATUS.SUCCESS) {
      window.location.href = "/";
    } else {
      setError("⚠️ Invalid email or password. Please check your credentials.");
    }
  } catch (err) {
    console.error(err.message);
    setError("⚠️ A server error occurred. Please try again later.");
  }
};

  return (
    <div className="login-page">
    <div className="login">
      <h3 className="title">Login</h3>
      <input
        type="email"
        className="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        name="email"
        placeholder="Email"
      />
      <br />
      <input
        type="password"
        className="password"
        onChange={(e) => setPassword(e.target.value)}
        name="password"
        value={password}
        placeholder="Password"
      />
      <br />
      {error && <div className="error-message">{error}</div>}
      <br />
      <button type="button" onClick={submit} className="submitLogin">
        Login
      </button>
      <br />
      <Link to="/Signup">
        <button className="link-btn">New user? Create account here.</button>
      </Link>
    </div>
    </div>
  );
}

export default Login;
