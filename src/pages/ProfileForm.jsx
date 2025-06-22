// src/pages/ProfileForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileForm = () => {
  const [form, setForm] = useState({
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
    localStorage.setItem("userProfile", JSON.stringify(form));
    navigate("/meal-plan");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Fitness Profile</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="fitnessGoal" placeholder="Fitness Goal (e.g. lose weight)" onChange={handleChange} required />
        <input name="diet" placeholder="Diet (e.g. vegan, keto)" onChange={handleChange} required />
        <input name="calories" placeholder="Target Calories (e.g. 2200)" onChange={handleChange} required />
        <input name="mealsPerDay" placeholder="Meals per Day (e.g. 3)" onChange={handleChange} required />
        <button className="bg-blue-500 text-white p-2 rounded" type="submit">Generate Plan</button>
      </form>
    </div>
  );
};

export default ProfileForm;
