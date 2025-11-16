import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import "./GrocerySync.css";

const GrocerySync = () => {
  const { token, user } = useAuth(); // Get token from AuthContext
  const [groceryList, setGroceryList] = useState([]);
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = user?.email
      ? localStorage.getItem(`checkedGroceries_${user.email}`)
      : null;
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMealPlan = async () => {
      setLoading(true);
      setError("");

      if (!user?.email) {
        setError("⚠️ No user profile found. Please log in.");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("⚠️ No authentication token found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        // ✅ NOW INCLUDES AUTHENTICATION TOKEN
        const res = await fetch(`https://backend-42kv.onrender.com/api/meal-plan`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        console.log("Response status:", res.status);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("API Error:", errorData);
          
          if (res.status === 401 || res.status === 403) {
            throw new Error("Authentication failed. Please log in again.");
          }
          
          throw new Error(errorData.error || `Server returned ${res.status}`);
        }

        const data = await res.json();
        console.log("Meal plan data:", data);
        
        if (!data || !Array.isArray(data) || data.length === 0) {
          setError("No saved meal plans found. Generate a meal plan first.");
          setGroceryList([]);
          setLoading(false);
          return;
        }

        const latestPlan = data[0];
        
        if (!latestPlan.meals || !Array.isArray(latestPlan.meals)) {
          setError("Meal plan has no meals. Please generate a new meal plan.");
          setGroceryList([]);
          setLoading(false);
          return;
        }

        // Extract ingredients safely
        const allIngredients = latestPlan.meals.flatMap((meal) => {
          if (!meal.ingredients || !Array.isArray(meal.ingredients)) {
            return [];
          }
          return meal.ingredients.map((i) => 
            typeof i === 'string' ? i.toLowerCase().trim() : String(i).toLowerCase().trim()
          );
        });

        const uniqueIngredients = Array.from(new Set(allIngredients)).filter(i => i.length > 0);
        
        if (uniqueIngredients.length === 0) {
          setError("No ingredients found in your meal plan. Please generate a new meal plan.");
        }
        
        setGroceryList(uniqueIngredients);
        
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Failed to load grocery list: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlan();
  }, [token, user?.email]);

  const toggleCheck = (item) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item)) newSet.delete(item);
      else newSet.add(item);
      
      try {
        if (user?.email) {
          localStorage.setItem(`checkedGroceries_${user.email}`, JSON.stringify(Array.from(newSet)));
        }
      } catch (err) {
        console.error("Error saving checked items:", err);
      }
      
      return newSet;
    });
  };

  return (
    <div className="grocerysync-root">
      <h2 className="grocerysync-title">🛒 Grocery Checklist</h2>
      {user && <h4>Logged in as: {user.email}</h4>}
      {loading ? (
        <p>Loading grocery list...</p>
      ) : error ? (
        <div className="grocerysync-error">
          <p>{error}</p>
          <p style={{ fontSize: '0.9em', marginTop: '10px', opacity: 0.8 }}>
            Check the browser console (F12) for more details.
          </p>
        </div>
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