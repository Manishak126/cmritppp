import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { JobResourcesContent } from "./_components/job_resources";

const JobResourcePage = async ({ params }: { params: { jobId: string } }) => {
  // const { userId } = await auth();

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
    },
    include: {
      company: true,
    },
  });

  if (!job) {
    redirect("/search");
  }

  return (
    <div className="flex-col p-4 md:p-8">
      <JobResourcesContent job={job} jobId={job.id} />
    </div>
  );
};

export default JobResourcePage;
