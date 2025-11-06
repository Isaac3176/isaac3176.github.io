import React, { useEffect, useState } from "react";
import "./GrocerySync.css";

const GrocerySync = () => {
  const [groceryList, setGroceryList] = useState([]);
  const [checkedItems, setCheckedItems] = useState(() => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const saved = userProfile
      ? localStorage.getItem(`checkedGroceries_${userProfile.email}`)
      : null;
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMealPlan = async () => {
      setLoading(true);
      setError("");

      const userProfile = localStorage.getItem("userProfile");
      if (!userProfile) {
        setError("⚠️ No user profile found. Please fill out your profile first.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userProfile);

      try {
        const res = await fetch(`https://backend-42kv.onrender.com/api/meal-plan/${user.email}`);
        if (!res.ok) throw new Error("Failed to fetch meal plan");

        const data = await res.json();
        if (!data.length) {
          setError("No saved meal plans found. Generate a meal plan first.");
          setGroceryList([]);
          setLoading(false);
          return;
        }

        const { meals } = data[0]; // most recent plan
        const allIngredients = meals.flatMap((meal) =>
          meal.ingredients.map((i) => i.toLowerCase().trim())
        );
        setGroceryList(Array.from(new Set(allIngredients)));
      } catch (err) {
        console.error(err);
        setError("Failed to load grocery list.");
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, []);

  const toggleCheck = (item) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item)) newSet.delete(item);
      else newSet.add(item);
      const userEmail = JSON.parse(localStorage.getItem("userProfile")).email;
      localStorage.setItem(`checkedGroceries_${userEmail}`, JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const user = JSON.parse(localStorage.getItem("userProfile"));

  return (
    <div className="grocerysync-root">
      <h2 className="grocerysync-title">🛒 Grocery Checklist</h2>
      {user && <h4>Logged in as: {user.email}</h4>}
      {loading ? (
        <p>Loading grocery list...</p>
      ) : error ? (
        <p className="grocerysync-error">{error}</p>
      ) : groceryList.length === 0 ? (
        <p>No ingredients found. Generate a meal plan first.</p>
      ) : (
        <ul className="grocerysync-list">
          {groceryList.map((item, i) => (
            <li key={i} className="grocerysync-item">
              <label>
                <input
                  type="checkbox"
                  checked={checkedItems.has(item)}
                  onChange={() => toggleCheck(item)}
                />
                <span className={checkedItems.has(item) ? "checked" : ""}>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GrocerySync;
