"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import toast from "react-hot-toast";
import { Job } from "@prisma/client";
import getGenerativeAIResponse from "@/scripts/aistudio";
import Editor from "@/components/ui/editor";
import { cn } from "@/lib/utils";
import Preview from "@/components/ui/preview";

interface QuestionFormProps {
  initialData: Job & { question?: string };
  jobId: string;
}

const formSchema = z.object({
  question: z.string().min(1),
});

export const QuestionForm = ({ initialData, jobId }: QuestionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rolename, setRolename] = useState("");
  const [skills, setSkills] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [aiValue, setAiValue] = useState("");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: initialData?.question || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Question Updated");
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `Could you please generate a list of interview questions tailored for the role of ${rolename}? The questions should cover key areas such as roles and responsibilities, technical skills, soft skills, and problem-solving abilities relevant to this position. Ensure the questions are categorized into:*
      1️. Technical Proficiency – Assessing skills related to ${skills}.
      2. Behavioral Questions – Understanding teamwork, leadership, and adaptability.
      3. Scenario-Based Questions – Real-world problem-solving and critical thinking.
      4. Optional Skill Areas – Questions covering any additional or optional skills relevant to the job.

    Please ensure the questions vary in complexity and are suitable for different interview stages (e.g., Screening, Technical Interview, HR Round). Also make sure the generated content has proper indentation and the question numbering`;

      await getGenerativeAIResponse(customPrompt).then((data) => {
        data = data.replace(/^'|'$/g, "");
        const cleanedText = data.replace(/[\*\#]/g, "");
        setAiValue(cleanedText);
        setIsPrompting(false);
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong...");
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copied to Clipboard");
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Question Tab
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Display the short description if not editing */}
      {!isEditing && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.question && "text-neutral-500 italic"
          )}
        >
          {!initialData.question && "No Question"}
          {initialData.question && <Preview value={initialData.question} />}
        </div>
      )}

      {/* display the category id if not editing
      {!isEditing && <p className="text-sm mt-2">{initialData.categoryId}</p>} */}

      {/* On editing mode display the input */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g 'Full- stack developer'"
              value={rolename}
              onChange={(e) => setRolename(e.target.value)}
              className="w-full p-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Required Skillsets"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-2 rounded-md"
            />
            {isPrompting ? (
              <>
                <Button>
                  <Loader2 className="w4 h-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handlePromptGeneration}>
                  <Lightbulb className="w4 h-4" />
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            Note*: Name alone enough to generate the tags
          </p>

          {aiValue && (
            <div
              className="w-full h-96 max-h-96 rounded-md bg-white
overflow-y-scroll p-3 relative mt-4 text-muted-foreground"
            >
              {aiValue}

              <Button
                className="absolute top-3 right-3 z-10"
                variant={"outline"}
                size={"icon"}
                onClick={onCopy}
              >
                <Copy className="w-4 h-4" />I
              </Button>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
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
        </>
      )}
    </div>
  );
};
