/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                translate_lg: {
                    "0%": { transform: "translateX(0px)" },
                    "100%": { transform: "translateX(300px)" }
                },
                translate_md: {
                    "0%": { transform: "translateX(0px)" },
                    "100%": { transform: "translateX(250px)" }
                },
                translate_sm: {
                    "0%": { transform: "translateX(0px)" },
                    "100%": { transform: "translateX(200px)" }
                }
            },
            animation: {
                translate_lg: "translate_lg 20s ease-in-out infinite",
                translate_md: "translate_md 15s ease-in-out infinite",
                translate_sm: "translate_sm 10s ease-in-out infinite"
            }
        },
    },
    plugins: [],
}

