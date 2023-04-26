import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const [themes, setThemes] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

 



  const toggledTheme = () => {
    setThemes((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    localStorage.setItem("theme", themes);
  }, [themes]); 
  
  const lightTheme = {
    primary : "bg-white",
    secondary : "bg-white",
    textColor : "text-gray-600"
};
const darkTheme = {
    primary : "bg-black/[0.9]",
    secondary : "bg-black",
    textColor : "text-white"
    
};
  let theme = "light";
  
    switch(themes){
        case "light" :  
            theme = lightTheme;
            break;
        case "dark" : 
        theme = darkTheme
        break;
        default :
         theme = lightTheme;
         break
    }



  return <ThemeContext.Provider value={{
    theme,
    themes,
    toggledTheme
  }}>{children}</ThemeContext.Provider>;
};
