import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProfileForm from "./pages/ProfileForm";
import MealPlan from "./pages/MealPlan";
import GrocerySync from "./pages/GrocerySync";
import MealSchedulePage from "./pages/MealSchedulePage";
import TrackMacrosPage from "./pages/TrackMacrosPage";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const userProfile = localStorage.getItem("userProfile");
  
  if (!userProfile) {
    // Redirect to profile page if not filled out
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

const App = () => (
  <div className="app-container">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<ProfileForm />} />
      
      {/* Protected routes - require profile */}
      <Route 
        path="/meal-plan" 
        element={
          <ProtectedRoute>
            <MealPlan />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/meal-schedule" 
        element={
          <ProtectedRoute>
            <MealSchedulePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/track-macros" 
        element={
          <ProtectedRoute>
            <TrackMacrosPage />
          </ProtectedRoute>
        } 
      />
      
      <Route path="/grocery-sync" element={<GrocerySync />} />
    </Routes>
  </div>
);

export default App;