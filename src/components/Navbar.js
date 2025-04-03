import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/about">About</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/signup">Sign Up</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navbar;