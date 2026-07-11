import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

function getInitialTheme() {
    const value = document.getElementById("preferred-theme")?.textContent?.trim();
    return value === "dark" ? "dark" : "light";
}

const useTheme = (value) => {
    const [theme, setTheme] = useState(value);

    const changeTheme = () => {
        setTheme((v) => (v === "light" ? "dark" : "light"));
    };

    return [theme, changeTheme];
};

export const ContextProvider = ({ children }) => {
    const [theme, changeTheme] = useTheme(getInitialTheme());

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);