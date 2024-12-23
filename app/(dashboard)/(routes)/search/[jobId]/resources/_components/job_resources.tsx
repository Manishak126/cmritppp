"use client";

import Box from "@/components/ui/box";
import { CustomBreadCrumb } from "@/components/ui/customBreadCrumb";
import Preview from "@/components/ui/preview";
import { Company, Job } from "@prisma/client";
import Link from "next/link";

interface JobResourcesContentProps {
  job: Job & { company: Company | null };
  jobId: string;
}
export const JobResourcesContent = ({
  job,
}: JobResourcesContentProps) => {
  return (
    <>
      <Box className="mt-4">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Resources", link: "/resources" }]}
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
        </div>
      </Box>

   

      <Box>
          <Preview value={job?.question}/>
        </Box>
   
    


      
    </>
  );
};
