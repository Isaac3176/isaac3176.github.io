// src/pages/MealPlan.jsx
import React, { useEffect, useState } from "react";
import "./MealPlan.css"; // Optional for styles

const assistantId = "asst_TJoiHnBJWseYgvrC7GYeaqY6"; 

const MealPlan = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // Step 1: Start a new assistant run
  const startRun = async (prompt) => {
    const res = await fetch(`https://api.openai.com/v1/assistants/${assistantId}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        input: {
          content_type: "text",
          parts: [prompt],
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to start assistant run");
    }

    const data = await res.json();
    return data.id; // run ID
  };

  // Step 2: Poll the run until it finishes and get the full response
  const pollRun = async (runId) => {
    while (true) {
      const res = await fetch(`https://api.openai.com/v1/assistants/${assistantId}/runs/${runId}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to poll assistant run");
      }

      const data = await res.json();
      const messages = data?.messages || [];
      const lastMessage = messages[messages.length - 1];

      if (lastMessage && lastMessage.metadata?.status === "finished_successfully") {
        return lastMessage.content.parts.join("");
      }

      // Wait 1.5 seconds before polling again
      await new Promise((r) => setTimeout(r, 1500));
    }
  };

  useEffect(() => {
    const runMealPlan = async () => {
      setLoading(true);
      setError("");
      setMealPlan(null);

      const userProfile = localStorage.getItem("userProfile");
      if (!userProfile) {
        setError("⚠️ No user profile found. Please fill out your profile first.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userProfile);
      const prompt = `
Generate a ${user.diet} meal plan for someone trying to ${user.fitnessGoal}.
Make it ${user.calories} calories per day, split into ${user.mealsPerDay} meals.
Each meal should include:
- Name
- Ingredients
- Calories
- Protein, Carbs, Fats
Return the result in valid JSON format like:
{ "meals": [ { "name": ..., "ingredients": [...], "calories": ..., "protein": ..., "carbs": ..., "fats": ... }, ... ] }
`;

      try {
        const runId = await startRun(prompt);
        const result = await pollRun(runId);

        const parsed = JSON.parse(result);
        setMealPlan(parsed.meals || []);
      } catch (err) {
        setError(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    runMealPlan();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">🥗 Your AI-Generated Meal Plan</h2>

      {loading && <p className="text-center">Loading your meal plan...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {mealPlan && mealPlan.length > 0 && (
        <div className="space-y-6">
          {mealPlan.map((meal, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-2">{meal.name}</h3>
              <p className="mb-1">
                <strong>Calories:</strong> {meal.calories}
              </p>
              <p className="mb-1">
                <strong>Macros:</strong> {meal.protein}g Protein, {meal.carbs}g Carbs, {meal.fats}g Fats
              </p>
              <p className="mt-2">
                <strong>Ingredients:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700">
                {meal.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealPlan;
