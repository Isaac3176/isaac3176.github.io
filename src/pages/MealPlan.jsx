import React, { useEffect, useState } from "react";
import "./MealPlan.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const MealPlan = () => {
  const [mealPlan, setMealPlan] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout } = useAuth();

  const API_URL = "https://backend-42kv.onrender.com/api";

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Schedule button handler
  const handleScheduleClick = (meal) => {
    localStorage.setItem("selectedMealToSchedule", JSON.stringify(meal));
    navigate("/meal-schedule");
  };

  // Backend API call to generate a new meal plan
  const generateMealPlan = async () => {
    if (!user?.profile) {
      setError("⚠️ Please complete your profile first.");
      navigate("/profile-setup");
      return;
    }

    setGenerating(true);
    setError("");

    const prompt = `
Respond ONLY with valid minified JSON. NO explanations, NO markdown, NO code block, NO title, ONLY pure JSON. Example:
{"meals":[{"name":"...","ingredients":[],...}]}

Create a ${user.profile.diet} meal plan for someone trying to ${user.profile.fitnessGoal}. 
Target calories: ${user.profile.calories} per day. Meals per day: ${user.profile.mealsPerDay}.
Each meal should include:
- name
- ingredients (array of strings)
- calories (number)
- protein (number in grams)
- carbs (number in grams)
- fats (number in grams)

Return in format:
{"meals":[{"name":"...","ingredients":["..."],"calories":0,"protein":0,"carbs":0,"fats":0}, ... ]}
    `;

    try {
      const response = await fetch(`${API_URL}/meal-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate meal plan");
      }

      const data = await response.json();
      setMealPlan(data.meals || []);
    } catch (err) {
      console.error("Generate meal plan error:", err);
      setError(`❌ ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // Load meal plan on mount
  useEffect(() => {
    const loadMealPlan = async () => {
      if (!isAuthenticated || !token) {
        return;
      }

      setLoading(true);
      setError("");
      setMealPlan([]);

      if (!user?.profile?.diet) {
        setError("⚠️ Please complete your profile first.");
        setLoading(false);
        navigate("/profile-setup");
        return;
      }

      try {
        // Fetch past meal plans from backend
        const res = await fetch(`${API_URL}/meal-plan`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch past meal plans");
        }

        const data = await res.json();

        if (data.length > 0) {
          // Use most recent saved plan
          setMealPlan(data[0].meals || []);
        } else {
          // No saved plan, automatically generate one
          await generateMealPlan();
        }
      } catch (err) {
        console.error("Load meal plan error:", err);
        setError(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadMealPlan();
  }, [isAuthenticated, token, user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/profile-setup");
  };

  return (
    <div className="mealplan-root">
      <div className="mealplan-header">
        <div>
          <h2 className="mealplan-title">🥗 Your AI-Generated Meal Plan</h2>
          {user && <h4>Logged in as: {user.email}</h4>}
        </div>
        <div className="mealplan-actions">
          <button onClick={handleEditProfile} className="mealplan-edit-btn">
            ⚙️ Edit Profile
          </button>
          <button onClick={generateMealPlan} className="mealplan-regenerate-btn" disabled={generating}>
            {generating ? "🔄 Generating..." : "🔄 Generate New Plan"}
          </button>
          <button onClick={handleLogout} className="mealplan-logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>

      {loading && <p className="mealplan-loading">⏳ Loading your meal plan...</p>}
      {generating && <p className="mealplan-loading">🤖 AI is creating your personalized meal plan...</p>}
      {error && <p className="mealplan-error">{error}</p>}

      {!loading && !generating && mealPlan && mealPlan.length > 0 && (
        <div className="mealplan-list">
          {mealPlan.map((meal, index) => (
            <div key={index} className="mealplan-card">
              <h3 className="mealplan-mealname">{meal.name}</h3>
              <div className="mealplan-macros">
                <span><strong>Calories:</strong> {meal.calories}</span>
                <span>
                  <strong>Protein:</strong> {meal.protein}g &nbsp;
                  <strong>Carbs:</strong> {meal.carbs}g &nbsp;
                  <strong>Fats:</strong> {meal.fats}g
                </span>
              </div>
              <div className="mealplan-ingredients">
                <strong>Ingredients:</strong>
                <ul>
                  {meal.ingredients && meal.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
              <button
                className="mealplan-schedule-btn"
                onClick={() => handleScheduleClick(meal)}
              >
                📅 Add to Schedule
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && !generating && mealPlan.length === 0 && !error && (
        <div className="mealplan-empty">
          <p>No meal plans yet. Click "Generate New Plan" to create one!</p>
        </div>
      )}
    </div>
  );
};

export default MealPlan;