import React, { useEffect, useState } from "react";
import "./MealSchedule.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const meals = ["breakfast", "lunch", "dinner"];

const MealSchedulePage = () => {
  const [schedule, setSchedule] = useState({});
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    const existingSchedule = JSON.parse(localStorage.getItem("userMealSchedule")) || {};
    const newSchedule = {};
    for (const day of days) {
      newSchedule[day] = existingSchedule[day] || {
        breakfast: null,
        lunch: null,
        dinner: null,
      };
    }
    setSchedule(newSchedule);

    const meal = localStorage.getItem("selectedMealToSchedule");
    if (meal) {
      setSelectedMeal(JSON.parse(meal));
      localStorage.removeItem("selectedMealToSchedule");
    }
  }, []);

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
    localStorage.setItem("userMealSchedule", JSON.stringify(updatedSchedule));
    setSelectedMeal(null);
    alert(`Added "${selectedMeal.name}" to ${day} ${time}`);
  };

  const handleRemove = (day, time) => {
    const updatedSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [time]: null,
      },
    };

    setSchedule(updatedSchedule);
    localStorage.setItem("userMealSchedule", JSON.stringify(updatedSchedule));
  };

  return (
    <div className="schedule-root">
      <h2 className="schedule-title">📅 Weekly Meal Schedule</h2>
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
