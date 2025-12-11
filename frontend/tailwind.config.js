/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Dark theme base colors
                background: {
                    DEFAULT: '#0a0a0f',
                    secondary: '#0f0f15',
                    tertiary: '#141420',
                    card: '#12121a',
                },
                // Orange/Coral accent (primary action color)
                accent: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    DEFAULT: '#f97316',
                },
                // Purple/Magenta secondary accent
                purple: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    200: '#e9d5ff',
                    300: '#d8b4fe',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                    800: '#6b21a8',
                    900: '#581c87',
                    950: '#3b0764',
                },
                // Coral/Pink gradient color
                coral: {
                    DEFAULT: '#ff6b6b',
                    light: '#ff8787',
                    dark: '#ee5a5a',
                },
                // Text colors
                text: {
                    primary: '#ffffff',
                    secondary: '#a1a1aa',
                    muted: '#71717a',
                    accent: '#f97316',
                },
                // Border colors
                border: {
                    DEFAULT: '#27272a',
                    light: '#3f3f46',
                    accent: '#f97316',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'slide-left': 'slideLeft 0.5s ease-out',
                'slide-right': 'slideRight 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'bounce-soft': 'bounceSoft 2s infinite',
                'pulse-glow': 'pulseGlow 2s infinite',
                'shimmer': 'shimmer 2s infinite linear',
                'float': 'float 6s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
                'gradient-x': 'gradientX 3s ease infinite',
                'gradient-y': 'gradientY 3s ease infinite',
                'border-glow': 'borderGlow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideLeft: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideRight: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.4)' },
                    '50%': { boxShadow: '0 0 30px 10px rgba(249, 115, 22, 0)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                gradientX: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                gradientY: {
                    '0%, 100%': { backgroundPosition: '50% 0%' },
                    '50%': { backgroundPosition: '50% 100%' },
                },
                borderGlow: {
                    '0%, 100%': { borderColor: 'rgba(249, 115, 22, 0.5)' },
                    '50%': { borderColor: 'rgba(249, 115, 22, 1)' },
                },
            },
            boxShadow: {
                'glow': '0 0 20px rgba(249, 115, 22, 0.4)',
                'glow-lg': '0 0 40px rgba(249, 115, 22, 0.4)',
                'glow-xl': '0 0 60px rgba(249, 115, 22, 0.3)',
                'glow-purple': '0 0 30px rgba(168, 85, 247, 0.4)',
                'inner-glow': 'inset 0 0 20px rgba(249, 115, 22, 0.2)',
                'card': '0 4px 30px rgba(0, 0, 0, 0.3)',
                'card-hover': '0 8px 40px rgba(0, 0, 0, 0.4)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-accent': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                'gradient-purple': 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                'gradient-dark': 'linear-gradient(180deg, #0a0a0f 0%, #141420 100%)',
                'gradient-hero': 'radial-gradient(ellipse at 50% 0%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)',
                'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(249, 115, 22, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(249, 115, 22, 0.05) 0px, transparent 50%)',
            },
            borderRadius: {
                '4xl': '2rem',
            },
        },
    },
    plugins: [],
};
