import React from 'react'
import { ImSpinner8 } from 'react-icons/im'

export default function Loading({ page }) {
    return (
        <>
            <div className={`inline-flex items-center bg-white justify-center text-2xl gap-3 ${page ? 'w-full h-[100dvh]' : ''}`}>
                <ImSpinner8 className="animate-spin" />
                {/* <p>Loading</p> */}
            </div>
        </>
    )
}
