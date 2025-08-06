import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Smooth follower movement with delay
      setTimeout(() => {
        setFollowerPosition({ x: e.clientX, y: e.clientY });
      }, 100);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(false);
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  // Update cursor colors when theme changes
  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const follower = document.querySelector('.custom-cursor-follower') as HTMLElement;
    
    if (cursor && follower) {
      if (theme === 'custom') {
        // Get custom primary color from CSS variables
        const primaryColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--primary')
          .trim();
        
        if (primaryColor) {
          cursor.style.background = `radial-gradient(circle, hsl(${primaryColor}) 0%, hsl(${primaryColor} / 0.6) 70%, transparent 100%)`;
          follower.style.borderColor = `hsl(${primaryColor} / 0.3)`;
          
          if (isHovering) {
            const accentColor = getComputedStyle(document.documentElement)
              .getPropertyValue('--accent')
              .trim();
            cursor.style.background = `radial-gradient(circle, hsl(${accentColor}) 0%, hsl(${accentColor} / 0.8) 70%, transparent 100%)`;
            follower.style.borderColor = `hsl(${accentColor} / 0.6)`;
          }
        }
      }
    }
  }, [theme, isHovering]);

  return (
    <>
      <div
        className={`custom-cursor ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''}`}
        style={{
          left: `${position.x - 10}px`,
          top: `${position.y - 10}px`,
        }}
      />
      <div
        className={`custom-cursor-follower ${isHovering ? 'hover' : ''}`}
        style={{
          left: `${followerPosition.x - 20}px`,
          top: `${followerPosition.y - 20}px`,
        }}
      />
    </>
  );
};