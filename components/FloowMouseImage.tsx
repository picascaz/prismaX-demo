import useMobileDetect from "../hooks/useMobileDetect";

import React, { useRef, useEffect } from 'react';

function MovingImage({ src }: any) {
  const imageRef = useRef<HTMLImageElement>(null);
  const isMobile = useMobileDetect()

  useEffect(() => {
    if (isMobile) return
    const image = imageRef.current;

    const handleMouseMove = (event: { clientX: number; clientY: number; }) => {
      const rect = image!.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const moveX = (x - rect.width / 2) / 10;
      const moveY = (y - rect.height / 2) / 10;

      image!.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    const handleMouseLeave = () => {
      image!.style.transform = 'none';
    };

    image!.addEventListener('mousemove', handleMouseMove);
    image!.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      image!.removeEventListener('mousemove', handleMouseMove);
      image!.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile]);

  return (
    <img ref={imageRef} className='hover-image mo:mt-2 sm:hidden md:mt-10  w-full bg-cover max-w-[640px] md:max-w-[600px]  ws:max-w-[400px] bt:max-w-[500px] mo:max-w-[210px]' src={src} />
  );
}

export default MovingImage;