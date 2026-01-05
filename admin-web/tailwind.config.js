/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#2563EB',
                secondary: '#1E293B',
                accent: '#F59E0B',
                success: '#10B981',
                background: '#F8FAFC',
                card: '#FFFFFF',
            }
        },
    },
    plugins: [],
}
