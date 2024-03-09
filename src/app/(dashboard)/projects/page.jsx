import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'
import React from 'react'
import { GetAllProjects } from '../../../../action/api'

export default async function ProjectsPage() {
  let projects=await GetAllProjects()
  
  return (
    <section className='container'>
      <div className='flex justify-between mb-4 flex-row-reverse sm:flex-row flex-wrap'>
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
