import React, { useEffect, useState } from "react";
import "./MealPlan.css";

const MealPlan = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [rawResponse, setRawResponse] = useState(""); // For debugging

  // Backend API call
  const generateMealPlan = async (prompt) => {
    const response = await fetch("https://backend-42kv.onrender.com/api/meal-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const text = await response.text();
    
    setRawResponse(text); // Save raw response for debugging

    if (!response.ok) {
      throw new Error(text || "Server error");
    }
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error("Invalid JSON from backend: " + text);
    }
  };

  useEffect(() => {
    const runMealPlan = async () => {
      setLoading(true);
      setError("");
      setMealPlan(null);
      setRawResponse("");

      const userProfile = localStorage.getItem("userProfile");
      if (!userProfile) {
        setError("⚠️ No user profile found. Please fill out your profile first.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userProfile);
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

      try {
        const result = await generateMealPlan(prompt);
        setMealPlan(result.meals || []);
      } catch (err) {
        setError(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    runMealPlan();
  }, []);

  return (
    <div className="mealplan-root">
      <h2 className="mealplan-title">🥗 Your AI-Generated Meal Plan</h2>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealPlan;