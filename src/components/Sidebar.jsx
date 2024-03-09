'use client'

import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { RxCross1, RxDashboard } from 'react-icons/rx'
import { AiOutlineMenuUnfold } from 'react-icons/ai'
import { IoIosLogOut } from 'react-icons/io'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Avatar, Backdrop, IconButton, MenuItem, MenuList } from '@mui/material'
import { Logout } from '../../action/api'


export default function Sidebar() {
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const sidebarRef = useRef()

    async function apiLogout() {
        let loadingPromise = toast.loading("Loading...")
        try {
            setIsLoading(true)
            const res = await Logout()
            if (res) {
                router.push('/signin')
                toast.success("Logout Successfully!", { id: loadingPromise })
            } else {
                toast.error("Some error arised", { id: loadingPromise })
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            toast.dismiss(loadingPromise)
            setIsLoading(false)
        }
    }

    function openSidebar() {
        document.querySelector('body')?.classList.add('active_sidebar')
    }

    function closeSidebar() {
        document.querySelector('body')?.classList.remove('active_sidebar')
    }

    useEffect(() => {
        document.documentElement.addEventListener('click', function (e) {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) closeSidebar()
        })
    })

    return (
        <>
            <Backdrop className='backdrop' open={isLoading} />
            <div className='container mobile_top_nav border-b border-blight-1 sticky top-0 backdrop-blur-md z-[5] md:hidden'>
                <div
                    onClick={openSidebar}
                    className='h-[40px] w-[40px] border flex justify-center items-center cursor-pointer border-gray-400 rounded-full text-black my-2'
                >
                    <AiOutlineMenuUnfold className='text-2xl' />
                </div>
            </div>

            <div className='sidebar_overlay hidden z-10' />

            <aside ref={sidebarRef} className='main_sidebar overflow-y-auto md:h-screen h-full flex flex-col text-white bg-gray-900 border-r border-gray-300s min-w-[250px] p-4 md:sticky fixed top-0 bottom-0 md:left-0 left-[-100%] z-[20]'>
                <div className='flex items-center space-x-2 justify-between mb-8'>
                    <Link onClick={closeSidebar} href='/' className="bg-black border border-gray-600 select-none rounded-sm px-3 py-2 text-2xl font-semibold text-white">NXT</Link>
                    <div
                        onClick={closeSidebar}
                        className='h-[40px] w-[40px] border flex justify-center items-center cursor-pointer border-gray-400 rounded-full text-white md:hidden'
                    >
                        <RxCross1 />
                    </div>
                </div>
                <div className="flex flex-1 space-y-5 flex-col justify-between">
                    <div className="sidebar-menu space-y-2">
                        {
                            MenuItems.map((item, i) => (
                                <Link onClick={closeSidebar} key={i} href={item.link} className={`flex items-center text w-full rounded-md transition-all 
                                    ${'/' + pathname.split('/')[1] == item.link ? 'bg-gray-700 text-white' : 'md:hover:bg-gray-600 text-white'}
                                `}>
                                    <MenuItem className='rounded-md m-0 !w-full'>
                                        <div className='rounded-md flex items-center space-x-3'>
                                            <span>{item.icon}</span>
                                            <span>{item.name}</span>
                                        </div>
                                    </MenuItem>
                                </Link>
                            ))
                        }
                    </div>
                    <div className='flex w-full items-center text rounded-md transition-all'>
                        <MenuItem className='rounded-md w-full' onClick={apiLogout}>
                            <div className='rounded-md flex items-center space-x-3'>
                                <IoIosLogOut color='white' size={20} />
                                <span>Logout</span>
                            </div>
                        </MenuItem>
                    </div>
                </div>
            </aside>
        </>
    )
}

const MenuItems = [
    {
        name: 'Dashboard',
        icon: <RxDashboard />,
        link: '/'
    },
    {
        name: 'Projects',
        icon: <RxDashboard />,
        link: '/projects'
    },
    {
        name: 'Accounts',
        icon: <RxDashboard />,
        link: '/accounts'
    },
    {
        name: 'Transactions',
        icon: <RxDashboard />,
        link: '/transactions'
    },
    {
        name: 'Withdraw',
        icon: <RxDashboard />,
        link: '/withdraw'
    },
    {
        name: 'Customers',
        icon: <RxDashboard />,
        link: '/customers'
    },
    {
        name: 'Invoice',
        icon: <RxDashboard />,
        link: '/invoice'
    },
    {
        name: 'Activity',
        icon: <RxDashboard />,
        link: '/activity'
    },
    {
        name: 'Settings',
        icon: <RxDashboard />,
        link: '/settings'
    },
]