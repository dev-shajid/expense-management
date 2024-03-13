'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';

const queryClient = new QueryClient()
export default function Layout({ children }) {

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                {children}
            </MantineProvider>
        </QueryClientProvider>
    )
}
