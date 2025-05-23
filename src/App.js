import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import DailyTasks from "./components/DailyTasks";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Questionnaire from "./components/Questionnaire";
import Interests from './components/Interests';
import EditProfile from "./components/EditProfile";
import './App.css';

const ConditionalNavbar = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup', '/questionnaire'];
  const sidebarPaths = ['/tasks', '/interests', '/settings', '/edit-profile'];

  const isFromQuestionnaire = location.pathname === '/interests' && 
                            location.state?.fromQuestionnaire;

  if (isFromQuestionnaire) return null;

  if (sidebarPaths.includes(location.pathname)) {
    return <Sidebar />;
  }

  return !hideNavbarPaths.includes(location.pathname) ? <Navbar /> : null;
};

const ContentWrapper = () => {
  const location = useLocation();
  const sidebarPaths = ['/tasks', '/interests', '/settings', '/edit-profile'];

  const isFromQuestionnaire = location.pathname === '/interests' && 
                            location.state?.fromQuestionnaire;
  const hasSidebar = sidebarPaths.includes(location.pathname) && !isFromQuestionnaire;

  return (
    <div className={hasSidebar ? "content-with-sidebar" : ""}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/tasks" element={<DailyTasks />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </div>
  );
};

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        if (Date.now() >= exp * 1000) {
          localStorage.removeItem("token");
          navigate('/login');
        }
      } catch (err) {
        console.error("Invalid token format", err);
        localStorage.removeItem("token");
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <>
      <ConditionalNavbar />
      <ContentWrapper />
    </>
  );
}

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;