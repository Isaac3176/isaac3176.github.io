import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileSetup from "./pages/ProfileSetup";
import MealPlan from "./pages/MealPlan";
import GrocerySync from "./pages/GrocerySync";
import MealSchedulePage from "./pages/MealSchedulePage";
import TrackMacrosPage from "./pages/TrackMacrosPage";
import "./App.css";

// --------------------
// Protected Route Component
// Checks authentication AND profile completeness
// --------------------
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div style={loadingStyle}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to profile setup if profile incomplete
  if (!user?.profile?.diet || !user?.profile?.fitnessGoal) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

// --------------------
// Protected route without profile check
// Only checks authentication
// --------------------
const ProtectedRouteWithoutProfileCheck = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={loadingStyle}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// --------------------
// Auth Route
// Redirects logged-in users to /meal-plan
// --------------------
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={loadingStyle}>
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/meal-plan" replace />;
  }

  return children;
};

// --------------------
// Shared Loading Style
// --------------------
const loadingStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  fontSize: "20px",
  color: "#93c5fd",
  background: "#18181b",
};

// --------------------
// App Content
// --------------------
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      {/* Show Navbar only if authenticated */}
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Default route: redirect based on authentication */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
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

        {/* Profile setup */}
        <Route
          path="/profile-setup"
          element={
            <ProtectedRouteWithoutProfileCheck>
              <ProfileSetup />
            </ProtectedRouteWithoutProfileCheck>
          }
        />

        {/* Protected routes (require auth + complete profile) */}
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

        {/* Catch-all: redirect to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

// --------------------
// Main App
// --------------------
const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
