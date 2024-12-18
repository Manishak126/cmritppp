"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Company, Job } from "@prisma/client";
import Box from "@/components/ui/box";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Currency,
  Layers,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn, formattedString } from "@/lib/utils";
import { truncate } from "lodash";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface JobCardItemProps {
  job: Job;
  userId: string | null;
}

const JobCardItem = ({ job, userId }: JobCardItemProps) => {
  const typeJob = job as Job & {
    company: Company | null;
  };

  const company = typeJob.company;

  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const isSavedByUser = userId && job.savedUsers?.includes(userId);

  const SavedUsersIcon = isSavedByUser ? BookmarkCheck : Bookmark;

  const router = useRouter();

  const onClickSaveJob = async () => {
    try {
      setIsBookmarkLoading(true);
      if (isSavedByUser) {
        await axios.patch(`/api/jobs/${job.id}/removeJobFromCollection`);
        toast.success("Job Removed");
      } else {
        await axios.patch(`/api/jobs/${job.id}/saveJobToCollection`);
        toast.success("Job Saved");
      }
      router.refresh(); // Use router.refresh() instead of reload
    } catch (error) {
      toast.error("Something went wrong");
      console.log(`Error: ${(error as Error)?.message}`);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <motion.div layout>
      <Card className="h-full flex flex-col">
        <div className="w-full h-full p-4 flex flex-col items-start justify-start gap-y-4 ">
          {/* Saved users */}
          <Box className="w-full">
            <p
              className="text-sm text-muted-foreground"
            >
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
              })}
            </p>

            <Button variant={"ghost"} size={"icon"}>
              {isBookmarkLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div onClick={onClickSaveJob}>
                  <SavedUsersIcon
                    className={cn(
                      "w-4 h-4",
                      isSavedByUser
                        ? "text-emerald-500"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
              )}
            </Button>
          </Box>

          {/* Company Details */}
          <Box className="w-full items-center justify-start gap-x-4">
            <div className="w-12 h-12 min-w-12 min-h-12 border p-2 rounded-md relative flex items-center justify-center overflow-hidden">
              {company?.logo && (
                <Image
                  alt={company.name}
                  src={company?.logo}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
            </div>

            <div className="w-full">
              <p className="text-stone-700 font-semibold text-base w-full truncate">
                {job.title}
              </p>

              <Link
                href={`/company/${company?.id}`}
                className="text-xs text-green-500 w-full truncate"
              >
                {company?.name}
              </Link>
            </div>
          </Box>

          {/* Job Details */}
          <Box className="w-full">
            {job.shiftTiming && (
              <div className="text-xs text-muted-foreground flex items-center">
                <BriefcaseBusiness className="w-3 h-3 mr-1" />
                {formattedString(job.shiftTiming)}
              </div>
            )}

            {job.workMode && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Layers className="w-3 h-3 mr-1" />
                {formattedString(job.workMode)}
              </div>
            )}

            {job.hourlyRate && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Currency className="w-3 h-3 mr-1" />
                {job.hourlyRate} LPA
              </div>
            )}
          </Box>

          {job.short_description && (
            <CardDescription className="text-xs">
              {truncate(job.short_description, {
                length: 180,
                omission: "...",
              })}
            </CardDescription>
          )}

          {job.tags.length > 0 && (
            <Box className="w-full flex-wrap justify-start gap-1">
              {job.tags.slice(0, 6).map((tag, i) => (
                <p
                  key={i}
                  className="bg-gray-100 text-xs rounded-md px-2 py-[2px] font-semibold text-neutral-500"
                >
                  {tag}
                </p>
              ))}
            </Box>
          )}

          <Box className="w-full gap-2 mt-auto">
            <Link href={`/search/${job.id}`} className="w-full">
              <Button
                className="w-full border-green-500 text-green-500 hover:bg-transparent hover:text-green-600"
                variant={"outline"}
              >
                Details
              </Button>
            </Link>

            <Button
              className="w-full text-white hover:bg-green-800 bg-green-800/90 hover:text-white"
              variant={"outline"}
              onClick={onClickSaveJob}
            >
              {isSavedByUser ? "Saved" : "Save For Later"}
            </Button>
          </Box>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobCardItem;
