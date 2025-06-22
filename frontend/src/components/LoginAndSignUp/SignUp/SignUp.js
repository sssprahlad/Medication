import React, { useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    age: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
    const response = await fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      console.log("User created successfully");
      navigate("/");
      setFormData({
        user_name: "",
        email: "",
        age: "",
        password: "",
      });
      setError(data.message);
    } else {
      setError(data.error);
    }
  }catch(error){
    console.log(error.message);
    setError("backend api is not running");
    }

  };

  return (
    <div className="signup-main-container">
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <label htmlFor="user_name">Username</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
