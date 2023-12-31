import { useCallback, useEffect, useState } from "react";

const useScrollLock = () => {
  // const html: any = document?.querySelector("html");
  const [lastY, setLastY] = useState(-1);

  const scrollListener = useCallback(() => {
    window.scrollTo({
      top: lastY,
    });
  }, [lastY]);

  useEffect(() => {
    if (lastY !== -1) {
      window.addEventListener("scroll", scrollListener);
    }

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [lastY, scrollListener]);

  const lockScroll = useCallback(() => {
    const html = document.querySelector("html");
    if (html) {
      html.style.overflow = "auto";
      setLastY(window.scrollY);
    }
  }, []);

  const unlockScroll = useCallback(() => {
    const html = document.querySelector("html");
    if (html) {
      html.style.overflow = "";
      setLastY(-1);
    }
    // setLocked(false);
  }, []);

  return {
    lockScroll,
    unlockScroll,
  };
};

export default useScrollLock;
