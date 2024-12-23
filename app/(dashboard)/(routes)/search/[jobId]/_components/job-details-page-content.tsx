"use client";

import Box from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { CustomBreadCrumb } from "@/components/ui/customBreadCrumb";
import Preview from "@/components/ui/preview";
import { Company, Job } from "@prisma/client";
// import { UserProfile } from "@prisma/client";
import Link from "next/link";

interface JobDetailsPageContentProps {
  job: Job & { company: Company | null };
  jobId: string;
  // userProfile: UserProfile | null;
}
export const JobDetailsPageContent = ({
  job,
}: JobDetailsPageContentProps) => {
  return (
    <>
      <Box className="mt-4">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={job?.title !== undefined ? job.title : ""}
        />
      </Box>

      {/* Title and Action Buttons */}
      <Box className="mt-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-600">
            {job?.title}
          </h2>

          <Link href={`/companies/${job.companyId}`}>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-sm font-semibold">
                {job?.company?.name}
              </p>
            </div>
          </Link>

          {/* Action Button */}
          {/* <div>
            {userProfile ? (
              <>
                {
                  userProfile.targetedCompanies.some((savedJob) => savedJob.jobId ===jobId) ? (
                    <Button className="text-sm bg-blue-700 hover:bg-blue-900 hover:shadow-sm">
                        Apply
                    </Button>
                  )
                }
              </>
            ) : (
              <Link href={"/user"}>
                <Button className="text-sm px-8 bg-blue-700 hover:bg-blue-900 hover:shadow-sm">
                  Save
                </Button>
              </Link>
            )}
            
          </div> */}
        </div>
      </Box>

      {/* Description*/}
      <Box className="flex-col my-4 items-start justify-start px-4">
              {/* <h2 className="text-2xl font-bold">Description</h2> */}
              <p className="font-sans">{job?.short_description}</p>

      </Box>

      {job?.description && (
        <Box>
          <Preview value={job?.description}/>
        </Box>
      )}

      <Box className="flex justify-center items-center w-full mt-10">
        <Link href={`/search/${job.id}/resources`}>
        <Button className="bg-transparent border  text-blue-600 hover:shadow-md hover:bg-blue-600 hover:text-white border-blue-600">
          View Preparation Resources
        </Button> 
        </Link>
       
      </Box>



      
    </>
  );
};
