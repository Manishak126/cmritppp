import { CustomBreadCrumb } from "@/components/ui/customBreadCrumb";
import { Box } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CompanyDetailContentPage } from "./_components/company-detail-content";
import Image from "next/image";

const CompanyDetailPage = async ({
  params,
}: {
  params: { companyId: string };
}) => {
  const { userId } = await auth();

  const company = await db.company.findUnique({
    where: {
      id: params.companyId,
    },
  });

  if (!company || !userId) {
    redirect("/");
  }

  // const jobs= await getJobs({})
  const jobs = await db.job.findMany({
    where: {
      companyId: params.companyId,
    },
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={company?.name !== undefined ? company.name : ""}
        />
      </Box>

      {/* Company coverImage */}

      <div className="w-full flex items-center justify-center overflow-hidden relative h-80 -z-10">
        <Image
          alt={company?.name}
          src="/img/background.jpeg"
          fill
          className="w-full h-full object-cover"
        />
      </div>

      {/* Company Details */}
      <CompanyDetailContentPage jobs={jobs} company={company} userId={userId} />
    </div>
  );
};

export default CompanyDetailPage;
