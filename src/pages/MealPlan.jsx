import React, { useEffect, useState } from "react";
import "./MealPlan.css"; // Optional styling

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

  // Step 1: Create a thread
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
    return data.id; // message ID
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
        // Get messages
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
      // Wait before polling again
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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-center">
        🥗 Your AI-Generated Meal Plan
      </h2>

      {loading && <p className="text-center">Loading your meal plan...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {mealPlan && mealPlan.length > 0 && (
        <div className="space-y-6">
          {mealPlan.map((meal, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-xl font-semibold mb-2">{meal.name}</h3>
              <p className="mb-1">
                <strong>Calories:</strong> {meal.calories}
              </p>
              <p className="mb-1">
                <strong>Macros:</strong> {meal.protein}g Protein, {meal.carbs}g
                Carbs, {meal.fats}g Fats
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