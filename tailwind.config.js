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
        // ═══ OpenGravity V2 — Linear/Vercel/marketnow-inspired
        // Pure black background, mint + cyan accents, warm paper text.
        // DO NOT mix with old champagne palette (kept only for legacy dashboard).
        'og-bg': '#050505',                // pure black canvas
        'og-panel': '#0a0a0a',             // slightly raised surface
        'og-panel-2': '#101010',           // raised surface for cards
        'paper': '#f4f3ec',                // warm off-white text
        'mint': {
          DEFAULT: '#00F299',              // primary accent (electric mint)
          deep: '#00C97A',                 // hover/darker mint
          glow: 'rgba(0, 242, 153, 0.35)', // glow color
        },
        'cyan-elec': {
          DEFAULT: '#00d1ff',              // secondary accent (data cyan)
          deep: '#00A8CC',
        },
        // Legacy — keep for dashboard backwards compat
        'champagne': { DEFAULT: '#c9a96e', deep: '#a07840', light: '#e2c98f' },
        'plum': '#2d1b3e',
        'cream': '#e8e4d9',
        'ink': '#0a0a0d',
        'gladiator-green': '#00F299',
        'gladiator-purple': '#6d4aff',
        'gladiator-cyan': '#00d1ff',
        'dark-deep': '#050505',
        'dark-glass': 'rgba(244, 243, 236, 0.04)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        // Subtle technical grid (Linear/Vercel style)
        "og-grid":
          "linear-gradient(to right, rgba(244,243,236,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,243,236,0.04) 1px, transparent 1px)",
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        // Sharp design system — 4px max for "sharper than rounded-2xl"
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '4px',
        'md': '6px',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'marquee': 'marquee 40s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        'float-text': 'floatText 3s ease-in-out infinite',
        'float-3d': 'float3d 10s ease-in-out infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 3s linear infinite',
        // New V2 animations
        'blink': 'blink 1.1s steps(2, start) infinite',
        'glow-pulse': 'glowPulse 2.4s ease-in-out infinite',
        'scan-line': 'scanLine 4s linear infinite',
        'ticker': 'marquee 40s linear infinite',
        'bar-grow': 'barGrow 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 242, 153, 0.3)', opacity: '1' },
          '50%': { boxShadow: '0 0 40px rgba(0, 242, 153, 0.6)', opacity: '0.85' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        // Terminal cursor blink
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        // Mint glow pulse for hover-idle elements
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 242, 153, 0.0)' },
          '50%': { boxShadow: '0 0 24px 0 rgba(0, 242, 153, 0.25)' },
        },
        // Terminal scan line — moves top to bottom inside card
        scanLine: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(2000%)', opacity: '0' },
        },
        // Horizontal bar growth (for viability bars / progress)
        barGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px -3px var(--tw-shadow-color)',
        'glow-mint': '0 0 24px -2px rgba(0, 242, 153, 0.35)',
        'glow-cyan': '0 0 24px -2px rgba(0, 209, 255, 0.35)',
        'neon': '0 0 30px rgba(0, 242, 153, 0.3)',
        'premium': '0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(244, 243, 236, 0.05)',
        'inset-line': 'inset 0 0 0 1px rgba(244, 243, 236, 0.06)',
      },
    },
  },
  plugins: [],
};
