"use client"

import Box from "@/components/ui/box"
import { Card } from "@/components/ui/card"
import { Company } from "@prisma/client"
import { useRouter } from "next/navigation"

interface HomeCompaniesListProps{
    companies: Company[]
}

const CompanyListItemCard = ({company}:{company: Company})=>{
    const router = useRouter()
    return (
        <Card className="flex items-center gap-2 p-2 text-muted-foreground
hover:text-blue-700 hover:border-blue-500 hover: shadow-md
cursor-pointer" onClick={()=>router.push(`/companies/${company.id}`)}>
            <h2 className="font-serif font-semibold tracking-wide whitespace-nowrap">{company.name}</h2>
            <div>

            </div>
        </Card>
    )
}
export const HomeCompaniesList = ({companies}:HomeCompaniesListProps) => {
    return(
        <Box className="flex-col my-12">
            <h2 className="text-2xl tracking-wider font-bold font-sans">Top Recruiters Hiring from Our Campus</h2> 
            <div className="mt-12 flex w-full items-center justify-center flex-wrap gap-4">
                {
                    companies.map(item => (
                        <CompanyListItemCard company={item} key={item.id}/>

                    ))
                }
            </div>
        </Box>
    )
}