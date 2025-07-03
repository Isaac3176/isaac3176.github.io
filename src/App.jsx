import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProfileForm from "./pages/ProfileForm";
import MealPlan from "./pages/MealPlan";
import GrocerySync from "./pages/GrocerySync";
import MealSchedulePage from "./pages/MealSchedulePage";
import TrackMacrosPage from "./pages/TrackMacrosPage";
import "./App.css";

const App = () => (
  <div className="app-container">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<ProfileForm />} />
      <Route path="/meal-plan" element={<MealPlan />} />
      <Route path="/grocery-sync" element={<GrocerySync />} />
      <Route path="/meal-schedule" element={<MealSchedulePage />} />
      <Route path="/track-macros" element={<TrackMacrosPage />} />
    </Routes>
  </div>
);

export default App;