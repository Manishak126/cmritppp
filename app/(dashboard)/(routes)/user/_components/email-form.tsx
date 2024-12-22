"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Pencil, UserCircle } from "lucide-react";
import { Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import { UserProfile } from "@prisma/client";
import Box from "@/components/ui/box";
import { cn } from "@/lib/utils";

interface EmailFormProps {
  initialData: UserProfile | null
  userId: string;
}

const formSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }),
});

export const EmailForm = ({ initialData, userId }: EmailFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
        email: initialData?.email || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        await axios.patch(`/api/users/${userId}`, values);
        toast.success("Profile Updated");
        toggleEditing();
        router.refresh();
    } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <Box>
        {!isEditing && (
            <div className={cn("text-lg mt-2 flex items-center gap-2", !initialData?.email && ("text-neutral-500 italic") )}>

            <UserCircle className="w-4 h-4 mr-2"/>
            {initialData?.email ? initialData.email : "No Email"}

            </div>
        )}
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 flex-1">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem className="w-full">
                         <FormControl>
                            <Input  disabled={isSubmitting} placeholder="e.g 'sample@domain.com'"
                            {...field}
                            type="email"/>
                         </FormControl>
                        </FormItem>
                    )}
                    />

                    <div className="flex items-center gap-x-2">
                        <Button disabled={!isValid || isSubmitting} type="submit">Save</Button>
                    </div>

                   
                </form>
            </Form>
        )}
        <Button onClick={toggleEditing} variant={"ghost"}>
            {
                isEditing? (
                    <>Cancel</>
                ): (
                    <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Edit
                    </>
                )
            }
        </Button>
    </Box>
  );
};
