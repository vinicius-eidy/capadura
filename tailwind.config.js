/** @type {import('tailwindcss').Config} */

import tailwindcss from "@headlessui/tailwindcss";

module.exports = {
    mode: "jit",
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        fontFamily: {
            manrope: ["var(--font-manrope), sans-serif"],
            mono: ["var(--font-space-mono)", "ui-monospace", "SFMono-Regular"],
        },
        extend: {
            colors: {
                // light
                primary: "#F5F5F0",
                pink: {
                    500: "#F7A1C6",
                },
                green: {
                    500: "#5FAD56",
                },
                yellow: {
                    950: "#241909",
                },
                red: {
                    500: "#BA3B46",
                },

                // dark
                "primary-dark": "#1E191E",
            },
        },
    },
    plugins: [tailwindcss({ prefix: "ui" })],
};
