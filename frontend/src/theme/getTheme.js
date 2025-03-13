import { createTheme } from '@mui/material/styles';
import { blue, grey, teal } from '@mui/material/colors';

const palette = {
    primary: {
        main: teal[200],
        contrastText: blue[50],
    },
    secondary: {
        main: teal[300],
        contrastText: '#0ff',
    },
    background: {
        paper: '#f5f5f5',
        default: '#071544',
    },
    text: {
        primary: '#071544',
        secondary: grey[700],
    },
};

export const getTheme = () => {
    return createTheme({
        breakpoints: {
            values: {
                xxs: 0,
                xs: 300,
                sm: 600,
                md: 900,
                bg: 1000,
                lg: 1200,
                xl: 1536,
            },
        },
        palette,
        typography: {
            fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
            h1: {
                fontWeight: 700,
            },
            h2: {
                fontWeight: '700',
                fontSize: "2rem",
                color: '#fff'
            },
            h3: {
                fontWeight: '700',
                fontSize: "1.5rem",
                color: '#fff'
            },
            h4: {
                fontWeight: '700',
                fontSize: "1rem",
                color: '#fff'
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        color: 'darkblue',
                        ':hover': {
                            backgroundColor: palette.primary.main,
                            color: palette.secondary.contrastText,
                        }
                    },
                },
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiInputLabel-root': {
                            color: palette.secondary.main,
                        },
                    },
                },
            },
        },
    });
};
