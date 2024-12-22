"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1, { message: "company name cannot be empty" }),
});

const CompanyCreatePage = () => {
    // const [isLoading, setisLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const {isSubmitting, isValid }= form.formState
    const router= useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const response= await axios.post("/api/companies", values);
            router.push(`/admin/companies/${response.data.id}`);
            toast.success("Company Created");
        }catch(error){
            console.log((error as Error) ?.message);
            toast.error((error as Error) ?.message);

            // toast notification
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            {/* Common Container for Alignment */}
            <div className="w-full max-w-lg space-y-6">
                {/* Section: Name your Job */}
                <div>
                    <h1 className="text-2xl font-medium">Name your Company</h1>
                    <p className="text-sm text-neutral-500 mt-2 pb-5">
                       WHat would you like to name your company? Don&apos;t worry, you can
                        change this later.
                    </p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Form Field */}
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => {
                            return (
                    <>
                
                        {/* Job name */}
                        <FormItem className="mt-6"> {/* Added margin top to the entire FormItem */}
                            <FormLabel className="text-base font-medium">
                                Company Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    disabled={isSubmitting}
                                    placeholder="e.g. 'Delloite'"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>

                        {/* Role Description */}
                        <FormItem className="mt-2">
                            <FormDescription className="text-sm text-neutral-500">
                                name of this company
                            </FormDescription>
                        </FormItem>
                    </>
                        );
                    }}
                ></FormField>

                        {/* Buttons */}
                        <div className="flex items-center gap-x-2">
                            <Link href={"/admin/jobs"}>
                                <Button type="button" variant={"ghost"}>
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};


export default CompanyCreatePage;

