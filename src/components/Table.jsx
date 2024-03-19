'use client'

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { useAsyncDebounce, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { GrNext, GrPrevious } from "react-icons/gr";
import dayjs from 'dayjs'
import { RxCross1 } from 'react-icons/rx'
import useApi from '@/lib/useApi'
import { GetAllActiviies } from '../../../../action/api'


export default function ActivityTable({ }) {
    const { totalActivities } = useApi()

    const [data, setData] = useState([])
    const { data: total } = totalActivities()

    const getAllActivities = useCallback(async ({ page, limit }) => {
        let res = await GetAllActiviies({ page: page, limit })
        // console.log(page, res)
        setData(res)
    }, [])


    const columns = useMemo(
        () => [
            {
                Header: 'Id',
                accessor: 'projectId',
            },
            {
                Header: 'Transaction Name',
                accessor: 'name',
            },
            // {
            //     Header: 'Details',
            //     accessor: 'transaction.details',
            // },
            {
                Header: 'Date',
                accessor: 'createdAt',
            },
            {
                Header: 'Amount',
                accessor: 'amount',
            },
            {
                Header: 'Project',
                accessor: 'project',
            },
            {
                Header: 'Type',
                accessor: 'type',
            },
            {
                Header: 'Action',
                accessor: 'action',
            },
        ],
        [])

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10, })

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
        setGlobalFilter
    } = useTable({
        columns,
        data,
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
    };


    useEffect(() => {
        getAllActivities({ page: state.pageIndex, pageSize: state.pageSize });
    }, [state.pageIndex, state.pageSize]);

    return (
        <>
            <GlobalFilter
                globalFilter={state?.globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
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
                                                    cell.column.Header == 'Date'
                                                        ? dayjs(cell.value)?.format('DD MMM YYYY, hh:mm:ss A')
                                                        : cell.column.Header == 'Id'
                                                            ? row?.index + 1 + 10 * pagination.pageIndex
                                                            : cell.column.Header == 'Type'
                                                                ? <p className={`${cell.value == 'income' ? 'bg-green-500' : 'bg-red-400'} font-medium text-white text-center inline-block capitalize rounded-full px-4`}>{cell.value}</p>
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