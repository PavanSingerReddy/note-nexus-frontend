import { useEffect } from 'react';


function useFavicon(darkIcon, lightIcon) {
  useEffect(() => {

    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    const currentIcon = document.querySelector('link[rel="icon"]');


    const switchFavicon = (e) => {
      const icon = e.matches ? lightIcon : darkIcon;
      currentIcon.href = icon;
    };


    switchFavicon(matcher);


    matcher.addEventListener('change', switchFavicon);


    return () => {
      matcher.removeEventListener('change', switchFavicon);
    };
  }, [darkIcon, lightIcon]);
}

export default useFavicon;
