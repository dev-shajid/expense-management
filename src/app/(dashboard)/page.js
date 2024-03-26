'use client'

import Loading from "@/components/Loading";
import { useUserContext } from "@/context/ContextProvider";
import useApi from "@/lib/useApi";
import { NumberFormatter } from "@mantine/core";
import axios from "axios"
import { useEffect, useState } from "react";

export default function Home() {
  const {user} = useUserContext()
  const { getBasicInfo } = useApi()

  const { data, isLoading } = getBasicInfo()

  if (isLoading) return <Loading page />

  const rows = [
    { title: "Total Projects", value: data.total_project },
    { title: "Ongoing Projects", value: data.ongoing_project },
    { title: "Project Done", value: data.total_project - data.ongoing_project },
    { title: "Income", value: <NumberFormatter thousandSeparator value={data.income}/> },
    { title: "Expense", value: <NumberFormatter thousandSeparator value={data.expense}/> },
    { title: "A/C Payable", value: <NumberFormatter thousandSeparator value={data.payable}/> },
    { title: "A/C Receivable", value: <NumberFormatter thousandSeparator value={data.receivable}/> },
  ]

  return (
    <section className="space-y-8">
      <div className='grid gap-4 lg:grid-cols-5 sm:grid-cols-3 grid-cols-2'>
        {
          rows.map((p, i) => user.role!='admin' && p.title=='Income'  ? null : (
            <div key={i} className='flex flex-col text-center justify-center items-center gap-1 bg-white rounded-md p-4 border'>
              <span className='text-xs'>{p.title}</span>
              <span className='text font-semibold min-w-fit'>{i>2?'৳':null} {p.value}</span>
            </div>
          ))
        }
      </div>
      <div className="text-3xl">
        Hello World
      </div>
    </section>
  );
}