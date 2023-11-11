import { useEffect } from 'react';

// hook which changes the favicon based on the user's system default theme
function useFavicon(darkIcon, lightIcon) {
  useEffect(() => {
    // Create a matcher for dark theme
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    const currentIcon = document.querySelector('link[rel="icon"]');

    // Function to switch favicon
    const switchFavicon = (e) => {
      const icon = e.matches ? lightIcon : darkIcon;
      currentIcon.href = icon;
    };

    // Switch favicon when component mounts
    switchFavicon(matcher);

    // Add listener to switch favicon when theme changes
    matcher.addEventListener('change', switchFavicon);

    // Cleanup: remove the listener when the component unmounts
    return () => {
      matcher.removeEventListener('change', switchFavicon);
    };
  }, [darkIcon, lightIcon]); // Only re-run if darkIcon or lightIcon changes
}

export default useFavicon;
