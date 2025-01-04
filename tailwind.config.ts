import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      gl: {
        'grayscale-base': 'rgba(238, 238, 238, 1)',
        'grayscale-100': 'rgba(245, 245, 245, 1)',
        'grayscale-200': 'rgba(158, 158, 158, 1)',
        'grayscale-300': 'rgba(128, 128, 128, 1)',
        'grayscale-opacity-50': 'rgba(158, 158, 158, 0.5)',
        'green-base': 'rgba(13, 152, 0, 1)',
        'green-opacity-30': 'rgba(13, 152, 0, 0.3)',
        'green-opacity-50': 'rgba(13, 152, 0, 0.5)',
        'red-base': 'rgba(255, 0, 0, 1)',
      },
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
