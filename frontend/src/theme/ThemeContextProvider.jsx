import React, { createContext, useContext } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './getTheme';

// Creo el contexto del tema
const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

// Creao el provider
export const ThemeContextProvider = ({ children }) => {

    const theme = getTheme();
    return (
        <ThemeContext.Provider value={{ theme }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;