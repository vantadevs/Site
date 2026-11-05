import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { ink:'#050B18', panel:'#0B1426', blue:'#168BFF', cyan:'#28D8F2' }, boxShadow: { glow:'0 0 40px rgba(22,139,255,.18)' } } }, plugins: [] } satisfies Config;
