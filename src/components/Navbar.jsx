import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => (
  <header className="navbar-header">
    <nav className="navbar-container">
      <NavLink to="/" className="navbar-logo">
        <span className="logo-text">FitPlate</span>
      </NavLink>
      <div className="nav-links">
        <NavLink
          to="/profile"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Profile
        </NavLink>
        <NavLink
          to="/meal-plan"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Meal Plan
        </NavLink>
        
      </div>
    </nav>
  </header>
);

export default Navbar;