import { useState, useEffect } from 'react';

const useMobileDetect = () => {
  const [isMobile, setIsMobile] = useState(false);

  const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

  const handleResize = () => {
    setIsMobile(getWindowWidth() <= 900);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
};

export default useMobileDetect;
