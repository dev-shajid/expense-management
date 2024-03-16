'use client'

import { useUserContext } from "@/context/ContextProvider";
import { ActionIcon } from "@mantine/core";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import useApi from "@/lib/useApi";
import { RxCross1 } from "react-icons/rx";

export default function HandleNewUserRequest({ users }) {
    const { deleteUser, verifyUser } = useApi()

    return (
        <>
            {
                users.length ?
                    <div className="space-y-2">
                        <div className="text-xl font-semibold">New Users</div>
                        <div className="overflow-x-auto max-w-fulls mx-auto rounded-md border border-blight-1">
                            <table className="w-full min-w-[400px] rounded-md overflow-hidden text-sm text-left rtl:text-right text-gray-600">
                                <thead className="text-gray-800 uppercase bg-gray-300">
                                    <tr align="center" className="border-b border-gray-200 bg-gray-300">
                                        <th>SL NO.</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>{
                                    users.map((user, i) => (
                                        <tr align="center" key={i} className="odd:bg-white even:bg-gray-200 border-b">
                                            <td>{i + 1}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td className="capitalize">{user?.role}</td>
                                            <td className="space-x-3">
                                                <ActionIcon
                                                    variant="light"
                                                    color="indigo"
                                                    size="sm"
                                                    onClick={() => {
                                                        let loadingPromise = toast.loading("Loading...")
                                                        verifyUser.mutate({ id: user.id }, {
                                                            onSuccess: () => {
                                                                toast.success("Verified Successfully!", { id: loadingPromise })
                                                            },
                                                            onError: (e) => {
                                                                console.log(e)
                                                                toast.error(e?.message || "Something is wrong!", { id: loadingPromise })
                                                            },
                                                        })
                                                    }}
                                                >
                                                    <FaCheck size={14} />
                                                </ActionIcon>
                                                <ActionIcon
                                                    variant="light"
                                                    color="red"
                                                    size="sm"
                                                    onClick={() => {
                                                        let loadingPromise = toast.loading("Loading...")
                                                        deleteUser.mutate({ id: user.id }, {
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
                                                    <ImCross size={12} />
                                                </ActionIcon>
                                            </td>
                                        </tr>
                                    ))
                                }</tbody>
                            </table>
                        </div>
                    </div>
                    : <></>
            }
        </>
    );
}