/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cf: {
          // Base surfaces
          bg:       '#F4F4F3',   // Architectural off-white
          surface:  '#FFFFFF',   // card white
          sidebar:  '#FFFFFF',   // pure white
          border:   '#1919191A', // 10% opacity charcoal
          // Text
          ink:      '#191919',   // primary text — charcoal
          muted:    '#9CA3AF',   // secondary text
          // Pastel Card Palette
          mint:     '#E8F5E9',   // Resolved/Success
          pink:     '#FDE7EF',   // Critical/Attention
          lavender: '#EDE7FB',   // AI/Priority
          peach:    '#FFF4E6',   // Pending/In Progress
          blue:     '#E7F1FD',   // Reports/Analytics
          // ONE primary accent — deep marine navy
          navy:     '#1F3A5F',
          // Secondary accent
          brass:    '#B0895B',
          // Status
          critical: '#B23A48',
          high:     '#C08A3E',
          medium:   '#3E6FA6',
          resolved: '#3F7A5B',
          // Active nav
          navActive: '#191919',
        }
      },
      fontFamily: {
        serif:   ['"P22 Mackinac W01 Book"', 'Georgia', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono:    ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '10px',
        sm:  '6px',
        md:  '10px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '24px',
        '3xl': '28px',
        '28px': '28px',
      },
      boxShadow: {
        subtle: '0 8px 30px rgba(0,0,0,0.03)',
        card:   '0 2px 10px rgba(28,27,25,0.07)',
        lift:   '0 20px 40px rgba(0,0,0,0.25)',     // Hover Shadow for hero
        hover:  '0 12px 32px rgba(0,0,0,0.06)',     // Standard Bento Hover
        navy:   '0 0 0 3px rgba(31,58,95,0.15)',
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px', letterSpacing: '0.06em' }],
        xs:    ['12px', { lineHeight: '16px' }],
        sm:    ['13px', { lineHeight: '20px' }],
        base:  ['14px', { lineHeight: '22px' }],
        lg:    ['16px', { lineHeight: '24px' }],
        xl:    ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['28px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
    },
  },
  plugins: [],
}
