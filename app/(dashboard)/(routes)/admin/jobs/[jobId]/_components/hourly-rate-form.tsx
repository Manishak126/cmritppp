"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface HourlyRateFormProps {
  initialData: { hourlyRate: string | null };
  jobId: string;
}

const formSchema = z.object({
  hourlyRate: z.string().min(1, "Please enter a valid CTC."),
});

export const HourlyRateForm = ({ initialData, jobId }: HourlyRateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(initialData.hourlyRate || ""); 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hourlyRate: hourlyRate || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Update in the database
      await axios.patch(`/api/jobs/${jobId}`, values);
      // Update local state to reflect UI changes
      setHourlyRate(values.hourlyRate);
      toast.success("CTC updated successfully.");
      toggleEditing();
    } catch (error) {
      toast.error("Something went wrong while updating the hourly rate.");
      console.log(error);

    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Expected CTC
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Display hourly rate if not editing */}
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !hourlyRate && "text-neutral-500 italic"
          )}
        >
          {hourlyRate || "Not Specified"}
        </p>
      )}

      {/* Render form when editing */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter hourly rate"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
