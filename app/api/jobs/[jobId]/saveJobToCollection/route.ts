import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface Context {
  params: {
    jobId: string;
  };
}

export const PATCH = async (req: Request, { params }: Context) => {
  try {
    const { userId } = await auth(); // Fetch userId from auth
    const { jobId } =  await params; // Directly extract jobId from params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Id is Missing", { status: 404 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
      
      },
    });

    console.log(job);

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    const updatedData = {
      savedUsers: job.savedUsers ? { push: userId } : [userId],
    };

    const updatedJob = await db.job.update({
      where: {
        id: jobId,
    
      },
      data: updatedData,
    });

    return NextResponse.json(updatedJob);
  } catch (err) {
    console.error(`[JOB_PUBLISH_PATCH] : ${err}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
