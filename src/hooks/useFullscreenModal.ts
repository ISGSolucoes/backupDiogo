import { useState } from "react";

export const useFullscreenModal = (initialFullscreen = false) => {
  const [isFullscreen, setIsFullscreen] = useState(initialFullscreen);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return {
    isFullscreen,
    toggleFullscreen,
    setIsFullscreen
  };
};