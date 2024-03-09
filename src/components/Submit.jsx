import { Button } from '@mui/material'
import React from 'react'

export default function Submit({className, value, ...other}) {
    return (
        <Button type='submit' {...other} variant="contained" className={`md:hover:bg-gray-800 ${className}`}>
            {value || "Submit"}
        </Button>
    )
}
