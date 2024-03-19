'use client'

import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React, { useMemo } from 'react'
import { useAsyncDebounce, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table'
import { GrNext, GrPrevious } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai"
import { FiEdit } from "react-icons/fi"
import dayjs from 'dayjs'
import useApi from '@/lib/useApi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Overlay from '@/components/Overlay'
import { RxCross1 } from 'react-icons/rx'


export default function WithdrawTable({ data }) {


    const { deleteWithdraw } = useApi()

    async function handleDelete(id) {
        let loadingPromise = toast.loading("Loading...")
        deleteWithdraw.mutate({ id }, {
            onSuccess: () => {
                toast.success("Deleted Withdraw!", { id: loadingPromise })
            },
            onError: (e) => {
                console.log(e)
                toast.error(e?.message || "Fail to delete Withdraw", { id: loadingPromise })
            },
        })
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Id',
                accessor: 'id',
            },
            {
                Header: 'Bank',
                accessor: (cell) => <Link href={`/withdraw/${cell.id}`}>{cell.bank_account}</Link>,
            },
            {
                Header: 'Date',
                accessor: (cell) => <span>{dayjs(cell.date)?.format('DD MMM YYYY, hh:mm A')}</span>,
            },
            {
                Header: 'Amount',
                accessor: 'amount',
            },
            {
                Header: 'Previous',
                accessor: 'previous',
            },
            {
                Header: 'Remaining',
                accessor: 'remaining',
            },
            {
                Header: 'Details',
                accessor: 'details',
            },
            {
                Header: 'Action',
                accessor: (cell) => {
                    return (
                        <div className='flex gap-3 justify-center items-center'>
                            <Link href={`/withdraw/edit/${cell.id}`}>
                                <FiEdit
                                    size={18}
                                    cursor='pointer'
                                />
                            </Link>
                            <AiOutlineDelete
                                size={20}
                                cursor='pointer'
                                onClick={() => handleDelete(cell.id)}
                            />
                        </div>
                    )
                }
            },
        ],
        [])


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


    if (deleteWithdraw.isError) return <pre>{JSON.stringify(deleteWithdraw.error, null, 2)}</pre>
    return (
        <>
            <Overlay isLoading={deleteWithdraw.isPending} />
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
                                    className={`md:hover:bg-gray-200 dark:md:lg:hover:bg-gray-700 border-0 border-b-[1px] border-b-gray-100 dark:border-gray-600`}
                                    {...resRow}>
                                    {row.cells.map((cell, j) => {
                                        const { key, ...restCell } = cell.getCellProps()
                                        // console.log(cell)
                                        return (
                                            <td
                                                key={j}
                                                className="px-5 md:py-5 py-3 md:text-base text-sm"
                                                {...restCell}
                                            >
                                                {
                                                    cell.column.Header == 'Id'
                                                        ? row?.index + 1
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