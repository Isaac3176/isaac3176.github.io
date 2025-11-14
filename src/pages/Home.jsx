import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Home.css";

const features = [
  {
    title: "Build My Profile",
    image: "/profile.jpg",
    link: "/profile",
  },
  {
    title: "View Meal Plan",
    image: "/meal.jpg",
    link: "/meal-plan",
  },
  {
    title: "Track Macros",
    image: "/macros.png",
    link: "/track-macros",
  },
  {
    title: "Grocery Sync",
    image: "/grocery.jpg",
    link: "/grocery-sync",
  },
];

const Home = () => (
  <div className="home-root">
    <div className="home-header">
      <h1 className="home-title">
        Welcome to <span>FITPLATE</span>
      </h1>
      <p className="home-desc">
        Your AI-powered meal planner for fitness and health.
      </p>
    </div>

    <div className="grid-container">
      {features.map((feature, index) =>
        feature.link ? (
          <Link to={feature.link} className="grid-item" key={index}>
            <img src={feature.image} alt={feature.title} />
            <div className="overlay">
              <h2>{feature.title}</h2>
            </div>
          </Link>
        ) : (
          <div className="grid-item disabled" key={index}>
            <img src={feature.image} alt={feature.title} />
            <div className="overlay">
              <h2>{feature.title}</h2>
            </div>
          </div>
        )
      )}
    </div>

    <h2 className="home-tagline">
      Eat smart. Train hard. <span>FitPlate does the planning.</span>
    </h2>

    <div className="demo-preview">
      <h3>Sample Meal Plan Preview</h3>
      <div className="demo-card">
        <strong>Breakfast:</strong> Greek Yogurt with Berries<br />
        <strong>Lunch:</strong> Grilled Chicken Salad<br />
        <strong>Dinner:</strong> Salmon, Quinoa & Veggies
      </div>
    </div>

    <div className="cta-banner">
      <span>Ready to transform your nutrition? Start your journey now!</span>
    </div>

    <div className="home-cta-container">
      {/* Get Started button */}
      <NavLink to="/register" className="cta-button">
        Get Started
      </NavLink>

      {/* Login button */}
      <NavLink to="/login" className="cta-button login-button">
        Login
      </NavLink>
    </div>

    <div className="home-footer">
      <p>© 2023 FitPlate. All rights reserved.</p>
      <footer className="footer">Built with ❤️ using React & OpenAI</footer>
    </div>
  </div>
);

export default Home;
