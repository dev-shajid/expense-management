import { Button } from '@mantine/core'
import React from 'react'

export default function Submit({className, value, ...other}) {
    return (
        <Button {...other} fullWidth className={`md:hover:bg-gray-800 w-full ${className}`}>
            {value || "Submit"}
        </Button>
    )
}
