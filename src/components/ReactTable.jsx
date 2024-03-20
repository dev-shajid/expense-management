'use client'

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React, { useRef, useState } from 'react'
import { useAsyncDebounce, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { GrNext, GrPrevious } from "react-icons/gr";
import { RxCross1 } from 'react-icons/rx'
import useApi from '@/lib/useApi'
import Loading from './Loading'
import { useQuery } from '@tanstack/react-query'
import { CSVLink } from 'react-csv'


export default function ReactTable({ getTableData, columns, db, query, handleCSVExport, csvData }) {
    const csvRef = useRef(null)
    const { totalCount } = useApi()
    const { data: total } = totalCount(db, query || {})
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10, })

    const TableData = useQuery({
        queryKey: [db, pagination, query],
        queryFn: () => getTableData({ page: pagination.pageIndex, limit: pagination.pageSize }),
    })

    const defaultData = React.useMemo(() => [], [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        state,
        setGlobalFilter,
    } = useTable({
        columns,
        data: TableData?.data ?? defaultData,
        initialState: pagination,
        manualPagination: true,
        pageCount: Math.ceil(total / 10),
    }, useGlobalFilter, useSortBy, usePagination)

    const goToNextPage = () => {
        nextPage();
        setPagination({ pageIndex: state.pageIndex + 1, pageSize: state.pageSize });
    };

    const goToPreviousPage = () => {
        previousPage();
        setPagination({ pageIndex: state.pageIndex - 1, pageSize: state.pageSize });
    }

    if (!TableData || TableData?.isLoading) return <Loading page />
    if (!TableData?.isLoading && !TableData?.data.length) return <div className='text-center font-medium text-2xl text-gray-400 select-none'>No Data!</div>
    return (
        <>
            <div className='flex flex-wrap justify-between items-center'>
                <GlobalFilter
                    globalFilter={state?.globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />

                {
                    handleCSVExport ?
                        <>
                            <CSVLink
                                data={csvData}
                                filename={`${db}.csv`}
                                ref={csvRef}
                                title={`${db}`}
                                target='_blank'
                            />
                            <button
                                onClick={() => handleCSVExport(csvRef)}
                                className='text-sm bg-gray-900 text-white rounded-md font-medium px-3 py-1'
                            >
                                Export
                            </button>
                        </> : null
                }
            </div>
            <div className='rounded-md overflow-x-auto'>
                <table {...getTableProps()} className='w-full table dark:text-white !text-sm min-w-[800px]'>
                    <thead>
                        {headerGroups.map((headerGroup, i) => {
                            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps()
                            return (
                                <tr key={key} {...restHeaderGroupProps}>
                                    {headerGroup.headers.map((column, j) => {
                                        const { key, ...restColumn } = column.getHeaderProps(column.getSortByToggleProps())
                                        return (
                                            <th align='center' key={key} {...restColumn} className="px-5 py-4 border-b-[1px] border-gray-300 dark:border-gray-600 bg-gray-300 dark:bg-gray-800 text-left md:text-base text-sm font-semibold uppercase" >
                                                <div className={`flex space-x-1 ${j == 0 ? '' : 'justify-center'} items-center`}>
                                                    <p className='relative'>
                                                        {column.render('Header')}
                                                        <span className={`absolute right-[-15px]`}>
                                                            {column.isSorted
                                                                ? column.isSortedDesc
                                                                    ? '▼'
                                                                    : '▲'
                                                                : ''}
                                                        </span>
                                                    </p>
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
                                                {
                                                    cell.column.Header == 'Id'
                                                        ? row?.index + 1 + 10 * pagination.pageIndex
                                                        : !cell.value
                                                            ? <RxCross1 className='mx-auto text-gray-400 select-none' />
                                                            : cell.value
                                                }
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
                <button disabled={!canPreviousPage} onClick={goToPreviousPage} className={`border disabled:opacity-30 border-gray-500 rounded-full p-2`}><GrPrevious /></button>
                <div>Page {state.pageIndex + 1} of {pageOptions.length}</div>
                <button disabled={!canNextPage} onClick={goToNextPage} className='border border-gray-500 disabled:opacity-30 rounded-full p-2'><GrNext /></button>
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
        <div className='py-4 min-w-[300px] my-4 flex justify-between items-center max-w-full overflow-x-hidden'>
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