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
        <NavLink
          to="/grocery-sync"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Grocery Sync
        </NavLink>
        <NavLink
          to="/meal-schedule"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Meal Schedule
        </NavLink>
        <NavLink
          to="/track-macros"
          className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
        >
          Track Macros
        </NavLink>

      </div>
    </nav>
  </header>
);

export default Navbar;
