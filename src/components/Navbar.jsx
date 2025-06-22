// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between">
    <Link to="/" className="font-bold text-lg">NutriAI</Link>
    <div className="space-x-4">
      <Link to="/profile">Profile</Link>
      <Link to="/meal-plan">Meal Plan</Link>
    </div>
  </nav>
);

export default Navbar;
