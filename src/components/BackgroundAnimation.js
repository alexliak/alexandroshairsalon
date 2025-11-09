import { useEffect } from 'react';
import './BackgroundAnimation.css'; // Ensure you have your CSS here

const BackgroundAnimation = () => {
  useEffect(() => {
    const root = document.getElementById('root');

    const createCircle = () => {
      const circle = document.createElement('div');
      const size = Math.random() * 50 + 50;
      circle.style.width = `${size}px`;
      circle.style.height = `${size}px`;
      circle.style.left = `${Math.random() * 100}vw`;
      circle.style.top = `${Math.random() * 100}vh`;
      circle.classList.add('circle');

      root.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 5000); // Remove the circle after 5 seconds
    };

    const interval = setInterval(createCircle, 500); // Create a new circle every 0.5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return null; // This component does not render anything visible
};

export default BackgroundAnimation;
