import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Profile from "./components/Profile";
import Contact from "./components/Contact";
import Tasks from "./components/Tasks";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Questionnaire from "./components/Questionnaire";
import './App.css';

const ConditionalNavbar = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup', '/questionnaire'];
  return !hideNavbarPaths.includes(location.pathname) ? <Navbar /> : null;
};

function App() {
  return (
    <Router>
      <ConditionalNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
      </Routes>
    </Router>
  );
}

export default App;