import React, { useEffect, useState } from "react";
import "./TrackMacros.css";

const TrackMacrosPage = () => {
  const [logs, setLogs] = useState([]);
  const [user, setUser] = useState(null);
  const [date] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
  });

  // Load user profile
  useEffect(() => {
    const profile = localStorage.getItem("userProfile");
    if (profile) setUser(JSON.parse(profile));
  }, []);

  const logsKey = user?.email ? `macroLogs_${user.email}` : "macroLogs_guest";

  // Load logs whenever user or date changes
  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem(logsKey)) || {};
    setLogs(storedLogs[date] || []);
  }, [date, logsKey]);

  const saveLogs = (updatedLogs) => {
    const allLogs = JSON.parse(localStorage.getItem(logsKey)) || {};
    allLogs[date] = updatedLogs;
    localStorage.setItem(logsKey, JSON.stringify(allLogs));
    setLogs(updatedLogs);
  };

  const handleAddMeal = () => {
    const meal = {
      ...newMeal,
      calories: parseInt(newMeal.calories),
      protein: parseInt(newMeal.protein),
      carbs: parseInt(newMeal.carbs),
      fats: parseInt(newMeal.fats),
    };
    const updatedLogs = [...logs, meal];
    saveLogs(updatedLogs);
    setNewMeal({ name: "", calories: "", protein: "", carbs: "", fats: "" });
  };

  const handleDelete = (index) => {
    const updatedLogs = logs.filter((_, i) => i !== index);
    saveLogs(updatedLogs);
  };

  const total = logs.reduce(
    (acc, m) => {
      acc.calories += m.calories;
      acc.protein += m.protein;
      acc.carbs += m.carbs;
      acc.fats += m.fats;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="track-root">
      <h2 className="track-title">📊 Track Macros - {date}</h2>

      {user && (
        <div>
          <h4>Logged in as: {user.email}</h4>
          <div className="macro-summary">
            <MacroBar label="Calories" current={total.calories} target={user.calories} />
            <MacroBar label="Protein" current={total.protein} target={user.protein || 120} />
            <MacroBar label="Carbs" current={total.carbs} target={user.carbs || 250} />
            <MacroBar label="Fats" current={total.fats} target={user.fats || 80} />
          </div>
        </div>
      )}

      <div className="meal-log">
        <h3>🍽 Meals Logged</h3>
        <ul>
          {logs.map((meal, index) => (
            <li key={index}>
              <strong>{meal.name}</strong> — {meal.calories} Cal, {meal.protein}P / {meal.carbs}C / {meal.fats}F
              <button onClick={() => handleDelete(index)}>❌</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="add-meal-form">
        <h3>➕ Add Meal</h3>
        <input
          type="text"
          placeholder="Meal name"
          value={newMeal.name}
          onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Calories"
          value={newMeal.calories}
          onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
        />
        <input
          type="number"
          placeholder="Protein (g)"
          value={newMeal.protein}
          onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
        />
        <input
          type="number"
          placeholder="Carbs (g)"
          value={newMeal.carbs}
          onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
        />
        <input
          type="number"
          placeholder="Fats (g)"
          value={newMeal.fats}
          onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
        />
        <button onClick={handleAddMeal}>Add</button>
      </div>
    </div>
  );
};

const MacroBar = ({ label, current, target }) => {
  const percent = Math.min((current / target) * 100, 100);
  return (
    <div className="macro-bar">
      <span>{label}: {current} / {target}</span>
      <div className="bar">
        <div className="fill" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};

export default TrackMacrosPage;
