"use client";

import Image from "next/image";
import { Job } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import JobCardItem from "./job-card-item";
import { fadeInOut } from "@/animations";

interface PageContentProps {
  jobs?: Job[]; // Mark jobs as optional
  userId: string | null;
}

export const PageContent = ({ jobs = [], userId }: PageContentProps) => {
  // console.log("PageContent jobs:", jobs);

  if (jobs.length === 0) {
    return (
      <div className="w-full flex items-center justify-center flex-col">
        <div className="w-full h-[60vh] relative flex items-center justify-center">
          <Image
            fill
            alt="Not Found"
            src="/img/404.jpg"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-4xl font-semibold text-muted-foreground">
          No Job Found
        </h2>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <AnimatePresence>
        <motion.div
          {...fadeInOut}
          layout
          className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-2 items-stretch"
        >
          {jobs.map((job) => (
            <JobCardItem key={job.id} job={job} userId={userId} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );                 
};
