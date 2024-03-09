'use client'

import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { GetAllProjects } from '../../../../action/api'
import Loading from '@/components/Loading'

export default async function ProjectsPage() {
  const [projects, setProject] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  async function getProjects() {
    try {
      setIsLoading(true)
      const res = await GetAllProjects()
      setProject(res)
    } catch (error) {
      console.log({Error: error.message})
    }
    finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getProjects()
  }, [])

  if (isLoading) return <Loading page />
  return (
    <section className='container'>
      <div className='flex justify-between mb-4 flex-wrap'>
        <div className="title">All Projects</div>
        <Link href={'/projects/addnew'} className="add_button">Add Projects</Link>
      </div>
      <div className='grid gap-4 xl:grid-cols-3 sm:grid-cols-2'>
        {
          projects.map((project, i) => (
            <Link href={`/projects/${project.id}`} key={i}>
              <ProjectCard key={i} project={project} />
            </Link>
          ))
        }
      </div>
    </section>
  )
}
