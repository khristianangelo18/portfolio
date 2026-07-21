"use client"; // CRITICAL: This is REQUIRED for motion/react to work in Next.js

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import './TiltedCard.css';

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  imageSrc,
  altText = 'Tilted card image',
  captionText,
  containerClassName = '',
  imageClassName = '',
  scaleOnHover = 1.05,
  rotateAmplitude = 12,
  showMobileWarning = true,
  showTooltip = true,
}) {
  const ref = useRef(null);
  const [lastY, setLastY] = useState(0);

  // Initialize mouse position motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Apply spring smoothers to make the motion gradual
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  // Initialize perspective and translation springs for the overlay
  const opacity = useSpring(0, springValues);
  const rotateFigX = useSpring(0, springValues);
  const rotateFigY = useSpring(0, springValues);

  function handleMouse(e) {
    if (!ref.current) return;

    // Calculate dimensions of the container
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to center (ranging from -0.5 to 0.5)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const relativeX = mouseX / width - 0.5;
    const relativeY = mouseY / height - 0.5;

    // Update motion values and spring targets
    x.set(mouseX);
    y.set(mouseY);
    
    // Reverse logic: Mouse left (-relativeX) tilts card right (+rotateY)
    rotateY.set(relativeX * rotateAmplitude); 
    rotateX.set(-relativeY * rotateAmplitude); 
    
    scale.set(scaleOnHover);
    opacity.set(1);
    
    // Set figure/overlay rotation slightly stronger for the 3D effect
    rotateFigX.set(-relativeY * rotateAmplitude * 1.4); 
    rotateFigY.set(relativeX * rotateAmplitude * 1.4);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    // Reset all spring targets to zero/initial
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigX.set(0);
    rotateFigY.set(0);
  }

  return (
    <figure
      ref={ref}
      className={`tilted-card-figure ${containerClassName}`}
      style={{
        perspective: '1000px', // Creates the 3D space
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="tilted-card-inner"
        style={{
          // Apply overall rotations and scale to the inner container
          rotateX,
          rotateY,
          scale,
        }}
      >
        <img
          src={imageSrc}
          alt={altText}
          className={`tilted-card-img ${imageClassName}`}
        />

        {showTooltip && (
          <motion.figcaption
            className="tilted-card-caption"
            style={{
              x, // Attach tooltip x/y to raw mouse motion values
              y,
              opacity, // Tooltip fades in/out on hover
              // Also apply slight rotation for perspective
              rotateX: rotateFigX,
              rotateY: rotateFigY,
            }}
          >
            {captionText}
          </motion.figcaption>
        )}
      </motion.div>
    </figure>
  );
}