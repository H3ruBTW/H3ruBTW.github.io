import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";
import { registerSW } from "virtual:pwa-register";
import { Root } from "./Root";
import { Home } from "./Home";
import { Scambio } from "./Scambio";
import { Andamento } from "./Andamento";
import { ContextProvider } from "./ThemeContext";
import "./css/index.css";

window.addEventListener("load", () => {
    registerSW({
        immediate: true,
    });
});

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Root />,
            children: [
                {
                    index: true,
                    element: <Home />,
                },
                {
                    path: "/currency",
                    element: <Andamento />,
                },
                {
                    path: "/exchange",
                    element: <Scambio />,
                },
            ],
        },
    ],
    {
        basename: "/CurrencyProject",
    }
);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ContextProvider>
            <RouterProvider router={router} />
        </ContextProvider>
    </StrictMode>
);