import { Button } from '@mantine/core'
import React from 'react'

export default function Submit({className, value, ...other}) {
    return (
        <Button type='submit' {...other} className={`md:hover:bg-gray-800 ${className}`}>
            {value || "Submit"}
        </Button>
    )
}
