'use client'

import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';

export default function Layout({children}) {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#000',
            },
            secondary: {
                main: '#3669f4',
            },
        },
    });
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}
