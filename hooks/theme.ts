
export const lightColors = {
    background: '#FFFFFF', // White
    text: '#121212',      // Dark Gray/Black
    primary: '#007AFF',    // Blue
    card: '#F5F5F5',       // Light Gray for containers
};

export const darkColors = {
    background: '#121212', // Dark Gray/Black
    text: '#FFFFFF',      // White
    primary: '#0A84FF',    // Lighter Blue
    card: '#2C2C2C',       // Dark Gray for containers
};

// A helper function to select the right set of colors
export const getThemeColors = (themeName: string) => {
    return themeName === 'dark' ? darkColors : lightColors;
};