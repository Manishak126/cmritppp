import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  ArrowLeft,
  Building2,
  LayoutDashboard,
  ListChecks,
  File,
} from "lucide-react";
import Link from "next/link";
import { JobPublishAction } from "./_components/job-publish-action";
import { Banner } from "@/components/ui/banner";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { CategoryForm } from "./_components/category-form";
import { ShortDescription } from "./_components/short-description";
import { ShiftTimingForm } from "./_components/shift-timing-mode";
import { HourlyRateForm } from "./_components/hourly-rate-form";
import { WorkModeForm } from "./_components/work-mode-form";
import { TagsForm } from "./_components/tags-form";
import { JobDescription } from "./_components/job-description";
import { CompanyForm } from "./_components/company-form";
import { QuestionForm } from "./_components/question-form";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  // Await the params if necessary
  const { jobId } = await params;

  // Validate the jobId format (MongoDB ObjectId format)
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(jobId)) {
    return redirect("/admin/jobs");
  }

  // Authenticate user
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  // Fetch job details
  const job = await db.job.findUnique({
    where: {
      id: jobId,
      userId,
    },
  });

  // Fetch categories
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Redirect if job not found
  if (!job) {
    return redirect("/admin/jobs");
  }

  // Determine completion status
  const requiredFields = [job.title, job.description, job.categoryId];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      {/* Back Button */}
      <Link href={"/admin/jobs"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>

      {/* Title and Publish Button */}
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Company Setup</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>
        <JobPublishAction
          jobId={jobId}
          isPublished={job.isPublished}
          disabled={!isComplete}
        />
      </div>

      {/* Warning Banner */}
      {!job.isPublished && (
        <Banner
          variant={"warning"}
          label="This Company is unpublished. It will not be visible in the companies list."
        />
      )}

      {/* Form Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          {/* Header */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your company</h2>
          </div>

          {/* Title Form */}
          <TitleForm initialData={job} jobId={job.id} />

          {/* Category Form */}
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />

          {/* Short Description Form */}
          <ShortDescription initialData={job} jobId={job.id} />

          {/* Shift Timing Form */}
          <ShiftTimingForm
            initialData={{ shiftTiming: job.shiftTiming }}
            jobId={job.id}
            options={[
              { label: "Full Time", value: "full-time" },
              { label: "Internship", value: "internship" },
              { label: "Contract", value: "contract" },
            ]}
          />

          {/* Hourly Rate */}
          <HourlyRateForm initialData={job} jobId={job.id} />

          {/* WorkMode */}
          <WorkModeForm
            initialData={{ workMode: job.workMode }}
            jobId={job.id}
            options={[
              { label: "Remote", value: "remote" },
              { label: "Hybrid", value: "hybrid" },
              { label: "Office", value: "office" },
            ]}
          />
        </div>

        {/* right container */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl text-neutral-700">Job Requirements</h2>
            </div>

            <TagsForm initialData={job} jobId={job.id} />
          </div>

          {/* company details*/}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Building2} />
              <h2 className="text-xl text-neutral-700">Company Details</h2>
            </div>

            {/* company details*/}
            <CompanyForm
              initialData={job}
              jobId={job.id}
              options={companies.map((company) => ({
                label: company.name,
                value: company.id,
              }))}
            />
          </div>

          {/* attachments */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl text-neutral-700">Job Attachments</h2>
            </div>
            <QuestionForm initialData={job} jobId={job.id}/>
          </div>
        </div>
      </div>

      {/* description */}

      <div className="col-span-2">
        <JobDescription initialData={job} jobId={job.id} />
      </div>
    </div>
  );
};

export default JobDetailsPage;
