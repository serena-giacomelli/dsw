import React from "react";
import Carousel from "./carousel.tsx";
import FloatingButton from "./floatingButton.tsx";
import FeaturedProductsCarousel from "../CU/featuredProductsCarousel.tsx";

const Home: React.FC = () => {
  return (
    <div>
      {/* Carousel principal */}
      <Carousel />

      {/* Banner debajo del primer carousel */}
      <div style={{ margin: "20px 0" }}>
        <FeaturedProductsCarousel />
      </div>

      {/* Botón flotante */}
      {location.pathname === "/" && <FloatingButton />}
    </div>
  );
};

export default Home;
