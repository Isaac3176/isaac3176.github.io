import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "./ProfileSetup.css";

const ProfileSetup = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.profile?.name || "",
    age: user?.profile?.age || "",
    weight: user?.profile?.weight || "",
    height: user?.profile?.height || "",
    gender: user?.profile?.gender || "",
    fitnessGoal: user?.profile?.fitnessGoal || "",
    diet: user?.profile?.diet || "",
    calories: user?.profile?.calories || "",
    mealsPerDay: user?.profile?.mealsPerDay || "3",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await updateProfile(formData);

    if (result.success) {
      navigate("/meal-plan");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card">
        <h2>🏋️ Set Up Your Profile</h2>
        <p className="profile-subtitle">Tell us about yourself to generate personalized meal plans</p>

        {error && <div className="profile-error">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weight">Weight (lbs)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="150"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">Height (inches)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="68"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fitnessGoal">Fitness Goal</label>
            <select
              id="fitnessGoal"
              name="fitnessGoal"
              value={formData.fitnessGoal}
              onChange={handleChange}
              required
            >
              <option value="">Select your goal</option>
              <option value="lose weight">Lose Weight</option>
              <option value="gain muscle">Gain Muscle</option>
              <option value="maintain weight">Maintain Weight</option>
              <option value="improve health">Improve Health</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="diet">Diet Preference</label>
            <select
              id="diet"
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              required
            >
              <option value="">Select diet type</option>
              <option value="balanced">Balanced</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
              <option value="low-carb">Low Carb</option>
              <option value="high-protein">High Protein</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="calories">Daily Calorie Target</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              placeholder="2000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mealsPerDay">Meals Per Day</label>
            <select
              id="mealsPerDay"
              name="mealsPerDay"
              value={formData.mealsPerDay}
              onChange={handleChange}
              required
            >
              <option value="2">2 meals</option>
              <option value="3">3 meals</option>
              <option value="4">4 meals</option>
              <option value="5">5 meals</option>
              <option value="6">6 meals</option>
            </select>
          </div>

          <button type="submit" className="profile-submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Profile & Generate Meal Plan"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;