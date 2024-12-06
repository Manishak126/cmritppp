import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import  Link from "next/link";

const JobsPageOverview=()=>{
    return <div className="p-6">
        <div className="flex items-end justify-end">
            <Link href={"/admin/create"}>
                <Button>
                    <Plus className="w-5 h-5 mr-2"></Plus>
                    New Job
                </Button>
            </Link>
        </div>
    </div>
}

export default JobsPageOverview;