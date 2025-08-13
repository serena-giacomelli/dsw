import "../../styles/Estructura/carousel.css";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/imagen1.jpg",
  "/imagen2.jpg",
  "/imagen3.jpg",
];

const Carousel: React.FC = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500 // Cambiado de 3000 a 1000 para mayor velocidad
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index}>
            <img src={src} alt={`Imagen ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;