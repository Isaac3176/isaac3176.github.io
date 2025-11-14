import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileSetup from "./pages/ProfileSetup";
import MealPlan from "./pages/MealPlan";
import GrocerySync from "./pages/GrocerySync";
import MealSchedulePage from "./pages/MealSchedulePage";
import TrackMacrosPage from "./pages/TrackMacrosPage";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "20px",
        color: "#93c5fd",
        background: "#18181b"
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if profile is complete (for routes that need it)
  if (!user?.profile?.diet || !user?.profile?.fitnessGoal) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

// Auth Route - redirects to meal-plan if already logged in
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "20px",
        color: "#93c5fd",
        background: "#18181b"
      }}>
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/meal-plan" replace />;
  }

  return children;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      {/* Only show Navbar when authenticated */}
      {isAuthenticated && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Auth Routes - redirect to meal-plan if logged in */}
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } 
        />

        {/* Profile Setup - needs authentication but not complete profile */}
        <Route 
          path="/profile-setup" 
          element={
            <ProtectedRouteWithoutProfileCheck>
              <ProfileSetup />
            </ProtectedRouteWithoutProfileCheck>
          } 
        />
        
        {/* Protected routes - require authentication AND complete profile */}
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
        <Route 
          path="/grocery-sync" 
          element={
            <ProtectedRoute>
              <GrocerySync />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

// Protected route that only checks authentication, not profile completion
const ProtectedRouteWithoutProfileCheck = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "20px",
        color: "#93c5fd",
        background: "#18181b"
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;