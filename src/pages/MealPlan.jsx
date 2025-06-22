// src/pages/MealPlan.jsx
import React, { useEffect, useState } from "react";

const MealPlan = () => {
  const [mealPlan, setMealPlan] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userProfile"));
    const prompt = `
Generate a ${user.diet} meal plan for ${user.fitnessGoal}.
Make it ${user.calories} calories per day, split into ${user.mealsPerDay} meals.
Each meal should list ingredients and estimated macros.
Format it in JSON.
`;

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_OPENAI_API_KEY`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const content = data.choices[0].message.content;
        try {
          const parsed = JSON.parse(content);
          setMealPlan(parsed.meals);
        } catch (err) {
          console.error("Failed to parse meal plan", err);
        }
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your AI-Generated Meal Plan</h2>
      {mealPlan ? (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(mealPlan, null, 2)}
        </pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MealPlan;

