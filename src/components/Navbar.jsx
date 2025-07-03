import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-text">FitPlate</span>
        </NavLink>

        <button className="hamburger" onClick={handleToggle}>
          ☰
        </button>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <NavLink to="/profile" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} onClick={closeMenu}>
            Profile
          </NavLink>
          <NavLink to="/meal-plan" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} onClick={closeMenu}>
            Meal Plan
          </NavLink>
          <NavLink to="/grocery-sync" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} onClick={closeMenu}>
            Grocery Sync
          </NavLink>
          <NavLink to="/meal-schedule" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} onClick={closeMenu}>
            Meal Schedule
          </NavLink>
          <NavLink to="/track-macros" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")} onClick={closeMenu}>
            Track Macros
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
