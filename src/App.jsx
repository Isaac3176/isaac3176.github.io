import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProfileForm from "./pages/ProfileForm";
import MealPlan from "./pages/MealPlan";
import "./App.css";

const App = () => (
  <div className="app-container">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<ProfileForm />} />
      <Route path="/meal-plan" element={<MealPlan />} />
    </Routes>
  </div>
);

export default App;