import React from "react";
import Carousel from "./carousel";
import Banner from "./banner.tsx";
import FloatingButton from "./floatingButton";

const Home: React.FC = () => {
  return (
    <div>
    <Carousel />
    {location.pathname === "/" && <FloatingButton />}
    </div>

  );
};

export default Home;