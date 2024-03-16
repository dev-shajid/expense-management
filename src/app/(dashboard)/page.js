'use client'

import Loading from "@/components/Loading";
import useApi from "@/lib/useApi";
import axios from "axios"
import { useEffect, useState } from "react";

export default function Home() {

  const { getBasicInfo } = useApi()

  const { data, isLoading } = getBasicInfo()

  if (isLoading) return <Loading page />

  const rows = [
    { title: "Total Projects", value: data.total_project },
    { title: "Ongoing Projects", value: data.ongoing_project },
    { title: "Project Done", value: data.end_project },
    { title: "Income", value: data.income },
    { title: "Expense", value: data.expense },
    { title: "A/C Payable", value: data.payable },
    { title: "A/C Receivable", value: data.receivable },
  ]

  return (
    <section className="space-y-8">
      <div className='grid gap-4 lg:grid-cols-5 sm:grid-cols-3 grid-cols-2'>
        {
          rows.map((p, i) => (
            <div key={i} className='flex flex-col text-center justify-center items-center gap-1 bg-white rounded-md p-4 border'>
              <span className='text-xs'>{p.title}</span>
              <span className='text font-semibold min-w-fit'>{p.value}</span>
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