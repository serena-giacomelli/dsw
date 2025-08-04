import React from "react";
import Carousel from "./carousel.tsx";
import FloatingButton from "./floatingButton.tsx";

const Home: React.FC = () => {
  return (
    <div>
    <Carousel />
    {location.pathname === "/" && <FloatingButton />}
    </div>

  );
};

export default Home;