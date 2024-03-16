'use client'

import HandleNewUserRequest from "./HandleNewUserRequest";
import HandleUserRequest from "./HandleUserRequest";
import Loading from "@/components/Loading";
import useApi from "@/lib/useApi";

export default function Admin() {
  const { getUsers } = useApi()
  const { data: users, isLoading } = getUsers()

  if (isLoading) return <Loading page />
  return (
    <>
      <section className="users_table container space-y-8">
        {users.filter(e => !e.verified).length ? <HandleNewUserRequest users={users.filter(e => !e.verified)} /> : null}
        {users.filter(e => e.verified).length ? <HandleUserRequest users={users.filter(e => e.verified)} /> : null}
      </section>
    </>
  );
}