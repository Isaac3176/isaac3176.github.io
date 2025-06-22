import React from "react";
import { Link } from "react-router-dom";
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
    title: "Track Macros (Coming Soon)",
    image: "/macros.png",
    link: null,
  },
  {
    title: "Grocery Sync (Coming Soon)",
    image: "/grocery.jpg",
    link: null,
  },
];

const Home = () => (
  <div className="home-root">
    <div className="home-header">
      <h1 className="home-title">Welcome to <span>FITPLATE</span></h1>
      <p className="home-desc">Your AI-powered meal planner for fitness and health.</p>
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

    <footer className="footer">Built with ❤️ using React & OpenAI</footer>
  </div>
);

export default Home;
