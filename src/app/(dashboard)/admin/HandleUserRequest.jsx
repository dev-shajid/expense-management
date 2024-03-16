'use client'

import { useUserContext } from "@/context/ContextProvider";
import { ActionIcon, Menu } from "@mantine/core";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HiOutlineDotsVertical } from "react-icons/hi";
import useApi from "@/lib/useApi";
import { RxCross1 } from "react-icons/rx";


export default function HandleNewUserRequest({ users, setUsers }) {
    const { dispatch, user } = useUserContext()
    const { deleteUser, roleLabManager, roleLabAsistant } = useApi()
    const router = useRouter()

    return (
        <>
            {
                users.length ?
                    <div className="space-y-2">
                        <div className="text-xl font-semibold">Users</div>
                        <div className="event_table overflow-x-auto max-w-fulls mx-auto rounded-md border border-blight-1">
                            <table className="w-full min-w-[400px] rounded-md overflow-hidden text-sm text-left rtl:text-right text-gray-600">
                                <thead className="text-gray-800 uppercase bg-gray-300">
                                    <tr align="center">
                                        <th>SL NO.</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map((item, i) => (
                                            <tr align="center" key={i} className="odd:bg-white even:bg-gray-200 border-b">
                                                <td>{i + 1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.email}</td>
                                                <td>{item.phone || <RxCross1 className='mx-auto text-gray-400 select-none' />}</td>
                                                <td className="flex flex-col gap-1">
                                                    <span className="capitalize">{item?.role}</span>
                                                    {item?.lab && <span className="">{`(${item?.lab[0].toUpperCase()}${item?.lab.slice(1)} Lab)`}</span>}
                                                </td>
                                                <td className="space-x-3 min-w-[110px]">
                                                    <>
                                                        <Menu width={200} shadow="md">
                                                            <Menu.Target>
                                                                <ActionIcon
                                                                    variant="transparent"
                                                                    size='sm'
                                                                    color="#000"
                                                                    className="!bg-inherit"
                                                                    disabled={item.role == 'admin'}
                                                                >
                                                                    <HiOutlineDotsVertical size={16} />
                                                                </ActionIcon>
                                                            </Menu.Target>

                                                            <Menu.Dropdown>
                                                                {/* <Menu.Item
                                                                    onClick={() => {
                                                                        let loadingPromise = toast.loading("Loading...")
                                                                        roleLabManager.mutate({ id: item.id }, {
                                                                            onSuccess: () => {
                                                                                toast.success("Role set Successfully!", { id: loadingPromise })
                                                                            },
                                                                            onError: (e) => {
                                                                                console.log(e)
                                                                                toast.error(e?.message || "Something is wrong!", { id: loadingPromise })
                                                                            },
                                                                        })
                                                                    }}
                                                                >
                                                                    Editor
                                                                </Menu.Item>
                                                                <Menu.Divider /> */}
                                                                <Menu.Item
                                                                    color="red"
                                                                    onClick={() => {
                                                                        let loadingPromise = toast.loading("Loading...")
                                                                        deleteUser.mutate({ id: item.id }, {
                                                                            onSuccess: () => {
                                                                                toast.success("Deleted Successfully!", { id: loadingPromise })
                                                                            },
                                                                            onError: (e) => {
                                                                                console.log(e)
                                                                                toast.error(e?.message || "Something is wrong!", { id: loadingPromise })
                                                                            },
                                                                        })
                                                                    }}
                                                                >
                                                                    Delete User
                                                                </Menu.Item>
                                                            </Menu.Dropdown>
                                                        </Menu>
                                                    </>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div >
                    : <></>
            }
        </>
    );
}