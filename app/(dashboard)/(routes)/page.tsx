import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/ui/box";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { HomesearchContainer } from "../_components/home-search-container";
import Image from "next/image";
import {HomeScreenCategoriesContainer } from "../_components/home-screen-categories-container";
import { HomeCompaniesList } from "../_components/home-companies-list";
import { RecommendedJobsList } from "../_components/recommended-jobs";
import { Footer } from "@/components/ui/footer";

const DashboardHomePage = async () => {
    // Fetch authenticated user
    const { userId } = await auth();
    
    // Fetch jobs, categories, and companies
    const jobs = await getJobs({});
    const categories = await db.category.findMany({
        orderBy: { name: "asc" },
    });
    const companies = await db.company.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="flex-col py-6 px-4 space-y-24">
            {/* Header Section */}
            <Box className="flex-col justify-center w-full space-y-4 mt-12">
                <h2 className="text-2xl md:text-4xl font-sans font-bold tracking-wide text-neutral-600">
                        Everything You Need for Placement in One Place.
                </h2>
                <p className="text-2xl text-muted-foreground">
                    {jobs.length} + Companies for you to Explore
                </p>
            </Box>

            {/* Search Container Section */}
            <HomesearchContainer />

            {/* Image Section */}

            {/* <Box className="relative overflow-hidden h-64 2xl:h-96 justify-center">
          

            </Box> */}
            <div className="flex justify-center items-center">
            <Image
                    alt="Home Screen Banner"
                    src="/img/job-portal-banner.png"
                    width={400}
                    height={240}
                    className="object-cover rounded-lg"
                />
            </div>

            <HomeScreenCategoriesContainer categories={categories}/>
            <HomeCompaniesList companies={companies}/>
            <RecommendedJobsList jobs={jobs.splice(0,6)} userId={userId}/>
            <Footer />
        </div>
    );
};

export default DashboardHomePage;
