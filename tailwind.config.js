export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        navy:        '#071038',
        'navy-2':    '#0B1A50',
        'navy-3':    '#0E2060',
        'navy-4':    '#122570',

        // Primary accent — orange
        orange:      '#FF6600',
        'orange-h':  '#FF7A1A',
        'orange-p':  'rgba(255,102,0,0.08)',

        // Secondary accent — electric blue
        'e-blue':    '#1A7BFF',
        'e-blue-l':  '#4DA3FF',
        'e-blue-p':  'rgba(26,123,255,0.10)',

        // Text
        white:       '#FFFFFF',
        cream:       '#F0F4FF',
        'gray-1':    '#B8CAEC',
        'gray-2':    '#6B82B0',

        // Borders
        border:      '#1A3070',
        'border-l':  '#24408A',

        // Semantic
        success:     '#22C55E',
        danger:      '#EF4444',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body:    ['Poppins', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
