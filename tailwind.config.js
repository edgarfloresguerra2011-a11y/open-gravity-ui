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
        'gladiator-green': '#39ff14',
        'gladiator-purple': '#5142f5',
        'gladiator-cyan': '#00f2ff',
        'dark-deep': '#050508',
        'dark-glass': 'rgba(20, 20, 25, 0.7)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'blob': 'blob 7s infinite',
        'marquee': 'marquee 25s linear infinite',
        'float-text': 'floatText 3s ease-in-out infinite',
        'float-3d': 'float3d 10s ease-in-out infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)', opacity: '1' },
          '50%': { boxShadow: '0 0 50px rgba(57, 255, 20, 0.8)', opacity: '0.8' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      },
      boxShadow: {
        'glow': '0 0 15px -3px var(--tw-shadow-color)',
        'neon': '0 0 20px rgba(57, 255, 20, 0.5)',
      }
    },
  },
  plugins: [],
};
