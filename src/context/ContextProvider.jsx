'use client'

import { createContext, useContext, useReducer } from "react";

const initialState = {
    user: null,
    invoice_items: { bill: {}, items: [] },
}


const Reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_USER':
            return { ...state, user: action.payload };
        case 'REMOVE_USER':
            return { ...state, user: null };
        case 'ADD_INVOICE':
            return { ...state, invoice_items: action.payload };
        case 'REMOVE_INVOICE':
            return { ...state, invoice_items: { bill: {}, items: [] } };
        default:
            return state
    }
}

export let Context = createContext()

export function useUserContext() {
    return useContext(Context)
}

export default function ContextProvider({ children }) {
    const [state, dispatch] = useReducer(Reducer, initialState)

    return (
        <Context.Provider value={{
            ...state,
            dispatch
        }}>
            {children}
        </Context.Provider>
    )
}