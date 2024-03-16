'use client'

import React, { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import Loading from './Loading';
import { GetAuthUser } from '../../action/api';
import { useUserContext } from '@/context/ContextProvider';

const queryClient = new QueryClient()
export default function Layout({ children }) {
    const { dispatch } = useUserContext()
    const [isLoading, setLoading] = useState(true)

    async function getAuthUser() {
        setLoading(true)
        try {
            let res = await GetAuthUser()
            if (res) dispatch({ type: 'ADD_USER', payload: res })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAuthUser()
    }, [])

    if (isLoading) return <Loading page />

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider>
                {children}
            </MantineProvider>
        </QueryClientProvider>
    )
}