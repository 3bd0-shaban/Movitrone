import { useEffect, useState } from 'react';

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<string>('');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newBreakpoint = '';

      if (width < 440) {
        newBreakpoint = 'xs'; // Extra Small
      } else if (width < 640) {
        newBreakpoint = 'sm'; // Small
      } else if (width < 768) {
        newBreakpoint = 'md'; // Medium
      } else if (width < 1024) {
        newBreakpoint = 'lg'; // Large
      } else if (width < 1280) {
        newBreakpoint = 'xl'; // Extra Large
      } else if (width < 1536) {
        newBreakpoint = '2xl'; // 2 Extra Large
      } else if (width < 1920) {
        newBreakpoint = '3xl'; // 3 Extra Large
      } else if (width < 2560) {
        newBreakpoint = '4xl'; // 4 Extra Large
      } else if (width < 3840) {
        newBreakpoint = '5xl'; // 5 Extra Large
      } else {
        newBreakpoint = '6xl'; // 6 Extra Large or greater
      }

      if (newBreakpoint !== breakpoint) {
        setBreakpoint(newBreakpoint);
      }
    };

    handleResize(); // Initial call to set breakpoint
    window.addEventListener('resize', handleResize); // Add event listener

    return () => {
      window.removeEventListener('resize', handleResize); // Remove event listener
    };
  }, [breakpoint]); // Empty dependency array ensures effect runs only once on component mount

  const isMobile = ['xs', 'sm', 'md', 'lg'].includes(breakpoint);

  return { breakpoint, isMobile };
};

export default useBreakpoint;
