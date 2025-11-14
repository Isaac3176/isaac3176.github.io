import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        <div className="navbar-brand-section">
          <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
            <span className="logo-text">FitPlate</span>
          </NavLink>
          {user && (
            <span className="navbar-user-email">
              {user.email}
            </span>
          )}
        </div>

        <button className="hamburger" onClick={handleToggle}>
          ☰
        </button>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <NavLink 
            to="/meal-plan" 
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
            onClick={closeMenu}
          >
            Meal Plan
          </NavLink>
          <NavLink 
            to="/meal-schedule" 
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
            onClick={closeMenu}
          >
            Schedule
          </NavLink>
          <NavLink 
            to="/track-macros" 
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
            onClick={closeMenu}
          >
            Track Macros
          </NavLink>
          <NavLink 
            to="/grocery-sync" 
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
            onClick={closeMenu}
          >
            Grocery Sync
          </NavLink>
          <NavLink 
            to="/profile-setup" 
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} 
            onClick={closeMenu}
          >
            Profile
          </NavLink>
          <button className="nav-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;