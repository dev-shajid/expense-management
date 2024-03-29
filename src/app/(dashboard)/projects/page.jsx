'use client'

import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'
import Loading from '@/components/Loading'
import useApi from '@/lib/useApi'

export default function ProjectsPage() {
  const { getAllProjects } = useApi()
  let { data: projects, isError, error, isLoading } = getAllProjects()

  if (isError) return <div>{JSON.stringify(error, null, 2)}</div>
  if (isLoading) return <Loading page />

  return (
    <section className='container'>
      <div className='flex justify-between mb-4 flex-wrap'>
        <div className="title">All Projects</div>
        <Link href={'/projects/addnew'} className="add_button">Add Projects</Link>
      </div>
      {
        projects.length ?
          <div className='grid gap-4 xl:grid-cols-3 sm:grid-cols-2'>
            {
              projects?.map((project, i) => (
                <Link href={`/projects/${project.id}`} key={i}>
                  <ProjectCard key={i} project={project} />
                </Link>
              ))
            }
          </div> :
          <div className='text-center font-semibold text-xl text-gray-500'>No Project is found!</div>
      }
    </section>
  )
}