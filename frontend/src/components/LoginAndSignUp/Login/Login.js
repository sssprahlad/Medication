import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Login = () => {
    
  const [user_name, setUser_name] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigator = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();


    try{
      const response = await fetch("https://medication-ugnu.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_name, password }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        localStorage.setItem("token", data.jwtToken);
        localStorage.setItem("user_name", data.user_name);
        localStorage.setItem("email", data.email);
        navigator("/welcome", { replace: true });
      } else {
        setError(data.error);
      }
      setUser_name("");
      setPassword("");
    }catch(error){
      console.log(error.message);
      setError("backend api is not running");
      }
  
  };

  const token = localStorage.getItem("token");

  return (
    <>
      {token !== null ? (
        <Navigate to="/welcome" />
      ) : (
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Medication Login</h2>

            <div className="form-group">
              <label htmlFor="user_name">Username</label>
              <input
                type="text"
                id="user_name"
                value={user_name}
                onChange={(e) => setUser_name(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
            <>
              <button className="sign-up-button">
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="/signup"
                  type="button"
                >
                  SignUp
                </Link>
              </button>
              {error && <p className="error">{error}</p>}
            </>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
