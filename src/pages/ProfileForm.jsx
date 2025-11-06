import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileForm.css";

const ProfileForm = () => {
  const [form, setForm] = useState({
    email: "",
    fitnessGoal: "",
    diet: "",
    calories: "",
    mealsPerDay: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation for email/username
    if (!form.email.trim()) {
      alert("Please enter your email or username.");
      return;
    }

    localStorage.setItem("userProfile", JSON.stringify(form));
    navigate("/meal-plan");
  };

  return (
    <div className="profile-form-root">
      <div className="form-card">
        <h2 className="form-title">Set Your Fitness Profile</h2>
        <form onSubmit={handleSubmit} className="form-body">

          <label>
            Email / Username
            <input
              name="email"
              type="text"
              placeholder="Enter your email or username"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Fitness Goal
            <select name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange} required>
              <option value="">-- Select Goal --</option>
              <option value="lose weight">Lose Weight</option>
              <option value="gain muscle">Gain Muscle</option>
              <option value="maintain">Maintain</option>
            </select>
          </label>

          <label>
            Diet Preference
            <select name="diet" value={form.diet} onChange={handleChange} required>
              <option value="">-- Select Diet --</option>
              <option value="vegan">Vegan</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="halal">Halal</option>
              <option value="keto">Keto</option>
              <option value="gluten-free">Gluten-Free</option>
              <option value="no preference">No Preference</option>
            </select>
          </label>

          <label>
            Daily Calories
            <input
              name="calories"
              type="number"
              min="1000"
              max="5000"
              placeholder="e.g. 2200"
              value={form.calories}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Meals per Day
            <input
              name="mealsPerDay"
              type="number"
              min="1"
              max="6"
              placeholder="e.g. 3"
              value={form.mealsPerDay}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" className="form-button">
            Generate Meal Plan
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
