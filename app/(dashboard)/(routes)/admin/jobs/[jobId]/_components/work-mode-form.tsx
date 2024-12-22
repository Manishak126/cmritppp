"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ComboBox } from "@/components/ui/combo-box";
import axios from "axios";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface WorkModeFormProps {
  initialData: { workMode: string | null };
  jobId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  workMode: z.string().min(1, "Please select Work Mode."),
});

export const WorkModeForm = ({ initialData, jobId, options }: WorkModeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workMode: initialData?.workMode || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Work Mode updated successfully.");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update Work Mode.");
      console.error(error);

    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const selectedOption = options.find((option) => option.value === initialData.workMode);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Work Mode
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? "Cancel" : <>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </>}
        </Button>
      </div>                 

      {/* Display the workMode if not editing */}
      {!isEditing && (
        <p className={cn("text-sm mt-2", !initialData?.workMode && "text-neutral-500 italic")}>
          {selectedOption?.label || "No Work Mode selected"}
        </p>
      )}

      {/* Display the input form when editing */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="workMode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ComboBox
                      heading="Work Mode"
                      options={options}
                      value={field.value}
                      onChange={field.onChange}
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
