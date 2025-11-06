import React, { useEffect, useState } from "react";
import "./MealPlan.css";
import { useNavigate } from "react-router-dom";

const MealPlan = () => {
  const [mealPlan, setMealPlan] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [rawResponse, setRawResponse] = useState(""); // For debugging

  const navigate = useNavigate();

  // Schedule button handler
  const handleScheduleClick = (meal) => {
    localStorage.setItem("selectedMealToSchedule", JSON.stringify(meal));
    navigate("/meal-schedule");
  };

  // Backend API call to generate a new meal plan
  const generateMealPlan = async (prompt) => {
    const user = JSON.parse(localStorage.getItem("userProfile"));
    if (!user?.email) throw new Error("User email not found");

    const response = await fetch("https://backend-42kv.onrender.com/api/meal-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, userId: user.email }),
    });

    const text = await response.text();
    if (!response.ok) throw new Error(text || "Server error");

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error("Invalid JSON returned from server");
    }

    // Save locally per user
    localStorage.setItem(`userMealPlan_${user.email}`, JSON.stringify(data));
    setRawResponse(text); // optional debugging

    return data;
  };

  // Load meal plan on mount
  useEffect(() => {
    const loadMealPlan = async () => {
      setLoading(true);
      setError("");
      setMealPlan([]);
      setRawResponse("");

      const userProfile = localStorage.getItem("userProfile");
      if (!userProfile) {
        setError("⚠️ No user profile found. Please fill out your profile first.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userProfile);

      try {
        // 1️⃣ Fetch past meal plans from backend
        const res = await fetch(`https://backend-42kv.onrender.com/api/meal-plan/${user.email}`);
        if (!res.ok) throw new Error("Failed to fetch past meal plans");

        const data = await res.json();

        if (data.length > 0) {
          // Use most recent saved plan
          setMealPlan(data[0].meals || []);
        } else {
          // 2️⃣ If no saved plan, generate a new one
          const prompt = `
Respond ONLY with valid minified JSON. NO explanations, NO markdown, NO code block, NO title, ONLY pure JSON. Example:
{"meals":[{"name":"...","ingredients":[],...}]}

Create a ${user.diet} meal plan for someone trying to ${user.fitnessGoal}. 
Target calories: ${user.calories} per day. Meals per day: ${user.mealsPerDay}.
Each meal should include:
- name
- ingredients
- calories
- protein, carbs, fats

Return in format:
{"meals":[{"name":"...","ingredients":["..."],"calories":0,"protein":0,"carbs":0,"fats":0}, ... ]}
          `;

          const result = await generateMealPlan(prompt);
          setMealPlan(result.meals || []);
        }
      } catch (err) {
        console.error(err);
        setError(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadMealPlan();
  }, []);

  const user = JSON.parse(localStorage.getItem("userProfile"));

  return (
    <div className="mealplan-root">
      <h2 className="mealplan-title">🥗 Your AI-Generated Meal Plan</h2>
      {user && <h4>Logged in as: {user.email}</h4>}

      {loading && <p className="mealplan-loading">Loading your meal plan...</p>}
      {error && <p className="mealplan-error">{error}</p>}

      {mealPlan && mealPlan.length > 0 && (
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
                  {meal.ingredients.map((ing, i) => (
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
    </div>
  );
};

export default MealPlan;