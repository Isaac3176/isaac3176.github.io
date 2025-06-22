// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProfileForm from "./pages/ProfileForm";
import MealPlan from "./pages/MealPlan";
import Navbar from "./components/Navbar";

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<ProfileForm />} />
      <Route path="/meal-plan" element={<MealPlan />} />
    </Routes>
  </Router>
);

export default App;
