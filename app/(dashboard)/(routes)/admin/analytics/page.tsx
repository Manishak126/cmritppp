import {
  getTotalCompaniesOnPortal,
  getTotalJobsOnPortal,
  getTotalJobsOnPortalByUserId,
  getTotalCompaniesOnPortalByUserId,
  getPieGraphCompanyCreatedByUser,
  getPieGraphJobCreatedByUser
} from "@/actions/get-overview-analytics";
import Box from "@/components/ui/box";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OverviewPieChart } from "@/components/ui/overview-pie-chart";
import { auth } from "@clerk/nextjs/server";
import { Separator } from "@radix-ui/react-separator";
import { BriefcaseBusiness } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";


const DashboardAnalyticsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const totalJobsOnPortal = await getTotalJobsOnPortal();
  const totalJobsOnPortalByUser = await getTotalJobsOnPortalByUserId(userId);

  const totalCompaniesOnPortal = await getTotalCompaniesOnPortal();
  const totalCompaniesOnPortalByUser = await getTotalCompaniesOnPortalByUserId(
    userId
  );
const graphsJobPortal = await getPieGraphJobCreatedByUser(userId);
const graphsCompanyPortal = await getPieGraphCompanyCreatedByUser(userId);


  return (
    <Box className="flex flex-col items-start p-4">
      <div className="flex flex-col items-start">
        <h2 className="font-sans tracking-wider font-bold text-2xl">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Overview of your account
        </p>
      </div>

      <Separator className="my-4" />

      <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card>
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <BriefcaseBusiness className="w-4 h-4 " />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totalJobsOnPortal}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">Total Jobs By User</CardTitle>
            <BriefcaseBusiness className="w-4 h-4 " />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totalJobsOnPortalByUser}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <BriefcaseBusiness className="w-4 h-4 " />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totalCompaniesOnPortal}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">Total Companies By User</CardTitle>
            <BriefcaseBusiness className="w-4 h-4 " />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totalCompaniesOnPortalByUser}
          </CardContent>
        </Card>

        {/* month wise jobs count */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">Month Wise Jobs Count</CardTitle>
            <BriefcaseBusiness className="w-4 h-4 " />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <OverviewPieChart data={graphsJobPortal}/>
          </CardContent>
         
        </Card>

        {/*month wise companies count*/}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="items-center justify-between flex-row">
            <CardTitle className="text-sm font-medium">Month Wise Companies Count</CardTitle>
            <BriefcaseBusiness className="w-4 h-4 " />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <OverviewPieChart data={graphsCompanyPortal}/>
          </CardContent>
         
        </Card>
      </div>
    </Box>
  );
};

export default DashboardAnalyticsPage;
