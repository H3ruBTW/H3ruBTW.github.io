import React, { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router";
import "./css/index.css"
import { useThemeContext } from "./ThemeContext";

export const Root = () => {
    const {theme, changeTheme} = useThemeContext()

    return (
        <>
            <header>
                <div className="header-container">
                    <h1>Currency Monitor</h1>
                    <button className="theme-button" 
                        title={(theme === "light") ? "Passa al tema scuro" : "Passa al tema chiaro"} 
                        onClick={changeTheme}
                    >    
                    </button>
                </div>
                <nav>
                    <ul>
                        <li><NavLink className={({isActive}) => isActive ? "link-active" : "link"} to="/">Home</NavLink></li>
                        <li><NavLink className={({isActive}) => isActive ? "link-active" : "link"} to="/currency">Monitor Currency</NavLink></li>
                        <li><NavLink className={({isActive}) => isActive ? "link-active" : "link"} to="/exchange">Currency Exchange Rates</NavLink></li>
                    </ul>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <p>Buongallino Alessandro ©<br />All rights reserved.</p>
            </footer>
        </>
    )
}