"use client"

import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import {useSearchParams } from "next/navigation"

interface AppliedFiltersProps{
    categories: Category[]
}

export const AppliedFilters =({categories}:AppliedFiltersProps)=>{

    const searchParams= useSearchParams();
    
    const currentParams = Object.fromEntries(searchParams.entries());
    const shiftTimingParams= Object.fromEntries(
        Object.entries(currentParams).filter(([key])=>key==="shiftTiming")
    )
    const workingModesParams= Object.fromEntries(
        Object.entries(currentParams).filter(([key])=>key==="workMode")
    )

    const getCategoryName=(categoryId:string|null)=>{
        const category= categories.find(cat=>cat.id===categoryId)
        return category? category.name: categoryId
    }

    if(searchParams.size===0) return null


    return(
    <>
        <div className="mt-4 flex items-center gap-4">
            {shiftTimingParams && Object.entries(shiftTimingParams).map(([key,value])=>(      
                <>
                    {value.split(",").map(item=>(
                        <Button variant={"outline"} type="button" key={`${item}-${key}`} className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded md bg-blue-50/80 border-blue-100 capitalized cursor-pointer hover:bg-blue-50">
                            {item}
                        </Button>
                    ))}
                </>
            ))}

            {workingModesParams && Object.entries(workingModesParams).map(([key,value])=>(      
                    <>
                    {value.split(",").map(item=>(
                        <Button variant={"outline"} type="button" key={`${item}-${key}`} className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded md bg-blue-50/80 border-blue-100 capitalized cursor-pointer hover:bg-blue-50">
                            {item}
                        </Button>
                    ))}
                </>
            ))}

            {searchParams.get("categoryId") && 
                <Button variant={"outline"} type="button" className="flex items-center gap-x-2 text-neutral-500 px-2 py-1 rounded md bg-blue-50/80 border-blue-100 capitalized cursor-pointer hover:bg-blue-50">
                    {getCategoryName(searchParams.get("categoryId"))}
                </Button>
            }
        </div>

        {searchParams.get("title") &&(
            <div className="flex items-center justify-center flex-col my-4">
                <h2 className="text-3xl text-muted-foreground">You Searched for: {" "}<span className="font-bold text-neutral-900 capitalize">{searchParams.get("title")}</span></h2>
            </div>
        )}
    </>
    )
}
