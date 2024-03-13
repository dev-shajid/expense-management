import { LoadingOverlay } from '@mantine/core'
import React from 'react'

export default function Overlay({isLoading}) {
    return (
        <LoadingOverlay loaderProps={{ children: <></> }} visible={isLoading} overlayProps={{ blur: 4, bg: '#0008' }} />
    )
}
