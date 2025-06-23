import React, { useEffect, useState } from "react";
import "./MealPlan.css";

const assistantId = "asst_TJoiHnBJWseYgvrC7GYeaqY6"; // Replace with your assistant ID

const MealPlan = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const openAIHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    "OpenAI-Beta": "assistants=v2",
  };

  // Step 1: Create a thread from the openai API
  // This code is where the conversation will take place
  const createThread = async () => {
    const res = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: openAIHeaders,
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      let errorText = await res.text();
      throw new Error(errorText || "Failed to create thread");
    }
    const data = await res.json();
    return data.id; // thread ID
  };

  // Step 2: Add a user message to the thread
  const addMessage = async (threadId, prompt) => {
    const res = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/messages`,
      {
        method: "POST",
        headers: openAIHeaders,
        body: JSON.stringify({
          role: "user",
          content: prompt,
        }),
      }
    );
    if (!res.ok) {
      let errorText = await res.text();
      throw new Error(errorText || "Failed to add message");
    }
    const data = await res.json();
    return data.id; 
  };

  // Step 3: Start the assistant run
  const runAssistant = async (threadId, assistantId) => {
    const res = await fetch(
      `https://api.openai.com/v1/threads/${threadId}/runs`,
      {
        method: "POST",
        headers: openAIHeaders,
        body: JSON.stringify({
          assistant_id: assistantId,
        }),
      }
    );
    if (!res.ok) {
      let errorText = await res.text();
      throw new Error(errorText || "Failed to start assistant run");
    }
    const data = await res.json();
    return data.id; // run ID
  };

  // Step 4: Poll the run status, then get the messages
  const pollRun = async (threadId, runId) => {
    while (true) {
      const runRes = await fetch(
        `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
        {
          headers: openAIHeaders,
        }
      );
      if (!runRes.ok) {
        let errorText = await runRes.text();
        throw new Error(errorText || "Failed to poll assistant run");
      }
      const runData = await runRes.json();
      if (runData.status === "completed") {
        // Get the messages from the thread
        // This ode will return the last message from the assistant
        const messagesRes = await fetch(
          `https://api.openai.com/v1/threads/${threadId}/messages`,
          {
            headers: openAIHeaders,
          }
        );
        if (!messagesRes.ok) {
          let errorText = await messagesRes.text();
          throw new Error(errorText || "Failed to get messages");
        }
        const messagesData = await messagesRes.json();
        const responses = messagesData.data
          .filter((msg) => msg.role === "assistant")
          .map((msg) => {
            if (typeof msg.content === "string") return msg.content;
            if (msg.content?.[0]?.text?.value) return msg.content[0].text.value;
            if (msg.content?.[0]?.text) return msg.content[0].text;
            return "";
          });
        return responses[responses.length - 1];
      }
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
        const threadId = await createThread();
        await addMessage(threadId, prompt);
        const runId = await runAssistant(threadId, assistantId);
        const resultText = await pollRun(threadId, runId);

        let parsed;
        try {
          parsed = JSON.parse(resultText);
        } catch (err) {
          // Try to extract JSON if there's text around
          const match = resultText.match(/\{[\s\S]*\}/);
          if (match) parsed = JSON.parse(match[0]);
          else throw new Error("AI did not return valid JSON.");
        }

        setMealPlan(parsed.meals || []);
      } catch (err) {
        setError(`❌ ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    runMealPlan();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="mealplan-root">
      <h2 className="mealplan-title">
        🥗 Your AI-Generated Meal Plan
      </h2>

      {loading && <p className="mealplan-loading">Loading your meal plan...</p>}
      {error && <p className="mealplan-error">{error}</p>}

      {mealPlan && mealPlan.length > 0 && (
        <div className="mealplan-list">
          {mealPlan.map((meal, index) => (
            <div key={index} className="mealplan-card">
              <h3 className="mealplan-mealname">{meal.name}</h3>
              <div className="mealplan-macros">
                <span>
                  <strong>Calories:</strong> {meal.calories}
                </span>
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