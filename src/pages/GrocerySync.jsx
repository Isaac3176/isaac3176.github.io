import React, { useEffect, useState } from "react";
import "./GrocerySync.css";

const GrocerySync = () => {
  const [groceryList, setGroceryList] = useState([]);
  const [checkedItems, setCheckedItems] = useState(() => {
    const saved = localStorage.getItem("checkedGroceries");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    const userMealPlan = localStorage.getItem("userMealPlan");
    if (!userMealPlan) return;

    try {
      const { meals } = JSON.parse(userMealPlan);
      const allIngredients = meals.flatMap((meal) => meal.ingredients.map((i) => i.toLowerCase().trim()));
      const uniqueIngredients = Array.from(new Set(allIngredients));
      setGroceryList(uniqueIngredients);
    } catch (err) {
      console.error("Failed to parse meal plan:", err);
    }
  }, []);

  const toggleCheck = (item) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(item)) newSet.delete(item);
      else newSet.add(item);
      localStorage.setItem("checkedGroceries", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  return (
    <div className="grocerysync-root">
      <h2 className="grocerysync-title">🛒 Grocery Checklist</h2>
      {groceryList.length === 0 ? (
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
