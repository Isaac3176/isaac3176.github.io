import React, { useEffect, useState } from "react";
import "./MealSchedule.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const meals = ["breakfast", "lunch", "dinner"];

const MealSchedulePage = () => {
  const [schedule, setSchedule] = useState({});
  const [selectedMeal, setSelectedMeal] = useState(null);

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("userProfile"));
  const scheduleKey = user?.email ? `userMealSchedule_${user.email}` : "userMealSchedule_guest";

  useEffect(() => {
    if (!user?.email) return;

    // Load existing schedule or initialize
    const existingSchedule = JSON.parse(localStorage.getItem(scheduleKey)) || {};
    const newSchedule = {};
    for (const day of days) {
      newSchedule[day] = existingSchedule[day] || {
        breakfast: null,
        lunch: null,
        dinner: null,
      };
    }
    setSchedule(newSchedule);

    // Load any meal selected from MealPlan page
    const meal = localStorage.getItem("selectedMealToSchedule");
    if (meal) {
      setSelectedMeal(JSON.parse(meal));
      localStorage.removeItem("selectedMealToSchedule");
    }
  }, []); // ✅ Fixed: Empty dependency array - only run once on mount

  // Assign a meal to a day/time
  const handleAssign = (day, time) => {
    if (!selectedMeal) return alert("No meal selected from Meal Plan.");

    const updatedSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [time]: selectedMeal,
      },
    };

    setSchedule(updatedSchedule);
    localStorage.setItem(scheduleKey, JSON.stringify(updatedSchedule));
    setSelectedMeal(null);
    alert(`Added "${selectedMeal.name}" to ${day} ${time}`);
  };

  // Remove a meal from a day/time
  const handleRemove = (day, time) => {
    const updatedSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [time]: null,
      },
    };

    setSchedule(updatedSchedule);
    localStorage.setItem(scheduleKey, JSON.stringify(updatedSchedule));
  };

  return (
    <div className="schedule-root">
      <h2 className="schedule-title">📅 Weekly Meal Schedule</h2>
      {user && <h4>Logged in as: {user.email}</h4>}

      <div className="schedule-table">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              {meals.map((mealType) => (
                <th key={mealType}>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day}>
                <td><strong>{day}</strong></td>
                {meals.map((time) => {
                  const meal = schedule[day]?.[time];
                  return (
                    <td key={time}>
                      {meal ? (
                        <div className="assigned-meal">
                          <p>{meal.name}</p>
                          <button onClick={() => handleRemove(day, time)}>❌</button>
                        </div>
                      ) : (
                        <button
                          className="add-btn"
                          onClick={() => handleAssign(day, time)}
                        >
                          📅 Add Meal
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MealSchedulePage;