import { useEffect } from "react";

const ToggleMenu = (ref, setOpen) => {
  useEffect(() => {
    const handleClickRef = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", handleClickRef);
    return () => window.removeEventListener("click", handleClickRef);
  }, [ref]);
};

export default ToggleMenu;
