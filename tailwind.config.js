/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta editorial premium — dorado champagne + ciruela
        'champagne': {
          DEFAULT: '#c9a96e',
          deep: '#a07840',
          light: '#e2c98f',
        },
        'plum': '#2d1b3e',
        'cream': '#e8e4d9',
        'paper': '#f5f3ee',
        'ink': '#0a0a0d',
        // Legacy — mantener para componentes antiguos del dashboard
        'gladiator-green': '#c9a96e',    // ahora mapea a champagne
        'gladiator-purple': '#6d4aff',
        'gladiator-cyan': '#4dd6c5',
        'dark-deep': '#0c0c10',
        'dark-glass': 'rgba(245, 243, 238, 0.04)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'blob': 'blob 7s infinite',
        'marquee': 'marquee 25s linear infinite',
        'float-text': 'floatText 3s ease-in-out infinite',
        'float-3d': 'float3d 10s ease-in-out infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floatText: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '1' },
          '50%': { transform: 'translateY(-10px)', opacity: '0.8' },
        },
        float3d: {
          '0%, 100%': { transform: 'translateZ(0) rotateX(0) rotateY(0)' },
          '50%': { transform: 'translateZ(50px) rotateX(2deg) rotateY(2deg)' },
        },
        neonPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 169, 110, 0.3)', opacity: '1' },
          '50%': { boxShadow: '0 0 40px rgba(201, 169, 110, 0.6)', opacity: '0.85' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px -3px var(--tw-shadow-color)',
        'neon': '0 0 30px rgba(201, 169, 110, 0.3)',
        'premium': '0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(245, 243, 238, 0.05)',
      }
    },
  },
  plugins: [],
};
