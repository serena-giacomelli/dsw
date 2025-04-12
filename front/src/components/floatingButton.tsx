import React from "react";
import { useLocation } from "react-router-dom";
import "../styles/floatingButton.css";

const FloatingButton = () => {
  const location = useLocation();

  if (location.pathname !== "/") return null;

  return (
    <div className="floating-button">

      <span className="text">Contáctenos</span>
    </div>
  );
};

export default FloatingButton;