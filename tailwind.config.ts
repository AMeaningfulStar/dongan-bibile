import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        'layout-20-l': ['20px', { lineHeight: '100%', fontWeight: '400' }],
        'navigation-14-l': ['14px', { lineHeight: '100%', fontWeight: '400' }],
        'navigation-15-l': ['15px', { lineHeight: '100%', fontWeight: '400' }],
        'caption-13-l': ['13px', { lineHeight: '100%', fontWeight: '400' }],
        'caption-14-l': ['14px', { lineHeight: '100%', fontWeight: '400' }],
        'caption-14-m': ['14px', { lineHeight: '100%', fontWeight: '500' }],
        'caption-14-b': ['14px', { lineHeight: '100%', fontWeight: '700' }],
        'caption-15-l': ['15px', { lineHeight: '100%', fontWeight: '400' }],
        'caption-15-m': ['15px', { lineHeight: '100%', fontWeight: '500' }],
        'caption-16-l': ['15px', { lineHeight: '100%', fontWeight: '400' }],
        'caption-16-sb': ['16px', { lineHeight: '100%', fontWeight: '600' }],
        'caption-16-b': ['16px', { lineHeight: '100%', fontWeight: '700' }],
        'caption-18-sb': ['18px', { lineHeight: '100%', fontWeight: '600' }],
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      colors: {
        gl: {
          'grayscale-base': 'rgba(238, 238, 238, 1)',
          'grayscale-100': 'rgba(140, 140, 140, 1)',
          'grayscale-200': 'rgba(158, 158, 158, 1)',
          'green-base': 'rgba(13, 152, 0, 1)',
          'green-opacity-30': 'rgba(13, 152, 0, 0.3)',
          'green-opacity-50': 'rgba(13, 152, 0, 0.5)',
          'red-base': 'rgba(255, 0, 0, 1)',
          'white-base': 'rgba(254, 254, 254, 1)',
          'black-base': 'rgba(34, 34, 34, 1)',
          'black-opacity-30': 'rgba(34, 34, 34, 0.3)',
        },
      },

      boxShadow: {
        primary: '0px 6px 32px 0px rgba(36, 41, 101, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config
