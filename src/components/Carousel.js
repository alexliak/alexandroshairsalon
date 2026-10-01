import React, { useEffect, useState } from 'react';
import { Carousel } from 'antd';
import './Carousel.css';

const CustomCarousel = ({ images }) => {
  const [shuffledImages, setShuffledImages] = useState(images);

  const shuffleArray = (array) => {
    const cloned = [...array];
    for (let i = cloned.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }
    return cloned;
  };

  useEffect(() => {
    setShuffledImages(shuffleArray(images));

    const shuffleInterval = setInterval(() => {
      setShuffledImages(shuffleArray(images));
    }, 10000);

    return () => clearInterval(shuffleInterval);
  }, [images]);

  const getImageAlt = (imagePath) => {
    const imageName = imagePath.split('/').pop().replace(/\.(jpg|jpeg|png)$/i, '');
    return `Alexandros Hair Salon - Κομμωτήριο Θησείο, κέντρο Αθήνας - ${imageName}`;
  };

  return (
    <Carousel autoplay>
      {shuffledImages.map((image, index) => (
        <div key={index} className="carousel-slide">
          <img 
            src={image} 
            alt={getImageAlt(image)} 
            className="carousel-image"
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
      ))}
    </Carousel>
  );
};

export default CustomCarousel;
