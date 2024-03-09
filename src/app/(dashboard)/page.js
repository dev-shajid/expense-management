'use client'

import Loading from "@/components/Loading";
import axios from "axios"
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setLoading] = useState(true)
  const [user, setUser] = useState({})

  function authUser() {
    axios.get('http://localhost:3000/api/auth/authUser')
      .then(res => {
        setUser(res.data.user)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    authUser()
  }, [])

  if (isLoading) return (
    <section className='flex justify-center items-center h-[100dvh]'>
      <Loading />
    </section>
  )
  return (
    <>
      <div className="text-3xl">
        Hello World
      </div>
      <pre>{JSON.stringify(user, null, 3)}</pre>
    </>
  );
}


/*
  // In Server Side Rendering...
  import { cookies } from "next/headers";
  
  axios.get('http://localhost:3000/api/auth/authUser', {
    headers:{
      token: cookies().get('token').value
    },
  })
    .then(res => console.log(res.data))
*/