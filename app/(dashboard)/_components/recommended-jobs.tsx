"use client"

import Box from '@/components/ui/box'
import { Job } from '@prisma/client'
import React from 'react'
import { PageContent } from '../(routes)/search/_components/page-content'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface RecommendedJobsListProps{
  jobs: Job[],
  userId: string | null
}
export const RecommendedJobsList = ({jobs,userId} : RecommendedJobsListProps) => {
  return (
    <Box className='flex-col justify-center gap-y-4 my-6 mt-12'>

      <h2 className='text-2xl font-semibold tracking-wider font-sans'>
        Top Job Matches for You
      </h2>

      <div className='mt-4'>
        <PageContent jobs={jobs} userId={userId}/>
      </div>

      <Link href={"/search"} className="my-8">
        <Button className="w-44 h-12 rounded-xl  bg-transparent border-blue-500 border hover:bg-transparent hover:shadow-md text-blue-500 hover:text-blue-500">
          View All Jobs
        </Button>
      </Link>
    </Box>
  )
}
