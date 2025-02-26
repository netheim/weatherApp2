module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],

    theme: {
        screens: {
            'max-2xl': { max: '1600px' }, // Самый большой breakpoint
            'max-xl': { max: '1399px' },
            'max-lg': { max: '1200px' },
            'max-md': { max: '992px' },
            'max-sm': { max: '768px' },
            'max-xs': { max: '480px' },
        }
    }
    // Другие настройки...
}