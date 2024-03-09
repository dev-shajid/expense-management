'use client'

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React, { useReducer, useState } from 'react'
import data from '../../../lib/data.json'
import { useAsyncDebounce, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { GrNext, GrPrevious } from "react-icons/gr";

export const columns = [
    {
        Header: 'Id',
        accessor: 'id',
    },
    {
        Header: 'First Name',
        accessor: 'first_name',
    },
    {
        Header: 'Last Name',
        accessor: 'last_name',
    },
    {
        Header: 'Date of Birth',
        accessor: 'date_of_birth',
    },
    {
        Header: 'Country',
        accessor: 'country',
        // accessor: (d) => (
        //   <div className="flex space-x-4">
        //     <div className="font-semibold">BD</div>
        //     <div className=''>{d.country}</div>
        //   </div>
        // ),
    },
    {
        Header: 'Phone',
        accessor: 'phone',
    },
]


export default function TransactionTable() {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        prepareRow,
        state,
        setGlobalFilter
    } = useTable({ columns, data, initialState: { pageSize: 20, } }, useGlobalFilter, useSortBy, usePagination)

    return (
        <>
            <GlobalFilter
                globalFilter={state?.globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
            <div className='rounded-md overflow-x-auto'>
                <table {...getTableProps()} className='w-full dark:text-white !text-sm'>
                    <thead>
                        {headerGroups.map((headerGroup, i) => {
                            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
                            return (
                                <tr key={key} {...restHeaderGroupProps}>
                                    {headerGroup.headers.map((column, j) => {
                                        const { key, ...restColumn } = column.getHeaderProps(column.getSortByToggleProps())
                                        return (
                                            <th key={key} {...restColumn} className="px-5 py-4 border-b-[1px] border-gray-300 dark:border-gray-600 bg-gray-300 dark:bg-gray-800 text-left md:text-base text-sm font-semibold uppercase" >
                                                <div className='flex space-x-1 items-center'>
                                                    <span>{column.render('Header')}</span>
                                                    <span>
                                                        {column.isSorted
                                                            ? column.isSortedDesc
                                                                ? '▼'
                                                                : '▲'
                                                            : ''}
                                                    </span>
                                                </div>
                                            </th>
                                        )
                                    })}
                                </tr>
                            )
                        }
                        )}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row)
                            const { key, resRow } = row.getRowProps()
                            return (
                                <tr
                                    key={key}
                                    className={`md:lg:hover:bg-[#fff5] dark:md:lg:hover:bg-gray-700 border-0 border-b-[1px] border-b-gray-100 dark:border-gray-600`}
                                    {...resRow}>
                                    {row.cells.map((cell, j) => {
                                        const { key, ...restCell } = cell.getCellProps()
                                        return (
                                            <td
                                                key={j}
                                                className="px-5 md:py-5 py-3 md:text-base text-sm"
                                                {...restCell}
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div >
            <div className={`space-x-4 my-4 flex justify-center items-center ${!canNextPage && !canPreviousPage ? 'hidden' : ''}`}>
                <button disabled={!canPreviousPage} onClick={previousPage} className={`border disabled:opacity-30 border-gray-500 rounded-full p-2`}><GrPrevious /></button>
                <div>Page {state.pageIndex + 1} of {pageOptions.length}</div>
                <button disabled={!canNextPage} onClick={nextPage} className='border border-gray-500 disabled:opacity-30 rounded-full p-2'><GrNext /></button>

            </div>
        </>
    )
}

function GlobalFilter({ globalFilter, setGlobalFilter }) {
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(v => {
        setGlobalFilter(v || undefined)
    }, 300)

    return (
        <div className='py-4 my-4 flex justify-between items-center max-w-full overflow-x-hidden'>
            {/* Search:{' '} */}
            <input
                value={value || ""}
                onChange={e => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                placeholder={`Search by any fields...`}
                className='py-2 px-4 text-xs rounded-md max-w-[400px] w-full border bg-[#fff7] dark:bg-[#0001] border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-blue-700 dark:focus:border-blue-400 outline-none shadow-sm'
            />
        </div>
    )
}