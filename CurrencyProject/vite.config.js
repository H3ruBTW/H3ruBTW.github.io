import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    base: "/CurrencyProject/",
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "favicon.ico",
                "apple-touch-icon.png",
                "mask-icon.svg",
            ],
            devOptions: {
                enabled: true,
                type: "module",
            },
            manifest: {
                name: "Currency Exchange",
                short_name: "Exchange",
                description: "App React per il cambio valuta con preferiti",
                theme_color: "#14181c",
                background_color: "#14181c",
                display: "standalone",
                start_url: "/CurrencyProject/",
                scope: "/CurrencyProject/",
                icons: [
                    {
                        src: "/CurrencyProject/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/CurrencyProject/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/CurrencyProject/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
            },
        }),
    ],
});