import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => (
  <header className="navbar-header">
    <nav className="navbar-container">
      <NavLink to="/" className="navbar-logo">
        <span className="logo-text">NutriAI</span>
      </NavLink>
      <div className="nav-links">
        <NavLink to="/profile" className="nav-link">
          Profile
        </NavLink>
        <NavLink to="/meal-plan" className="nav-link">
          Meal Plan
        </NavLink>
        <NavLink to="/profile" className="cta-button">
          Get Started
        </NavLink>
      </div>
    </nav>
  </header>
);

export default Navbar;