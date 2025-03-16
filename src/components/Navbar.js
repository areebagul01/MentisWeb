import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className = "navbar"> 
      
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/about">About</Link>
        <Link to="/tasks">Tasks</Link>
        <Link to="/auth">Login / Sign Up</Link>
      
    </nav>
  );
}

export default Navbar;
// In this example, the Navbar component is a functional component that returns a navigation bar with links to different pages in the app. The component uses the Link component from react-router-dom to create clickable links that navigate to different routes in the app.