"use client";

import Box from '@/components/ui/box';
import { Category } from '@prisma/client';
import React from 'react'
import { Card } from '@/components/ui/card';
import { iconMapping, IconName } from '@/lib/utils';
import { ChevronRight} from 'lucide-react';
import qs from "query-string"
import { useRouter } from 'next/navigation';

interface HomeScreenCategoriesContainerProps {
    categories: Category[];
    
}

export const Icon = ({name}:{name: IconName}) => {
    const IconComponent = iconMapping[name]
    return IconComponent? <IconComponent className='w-5 h-5'/>: null
}

export const CategoryListItemCard = ({data}: {data:Category}) => {
    const router = useRouter();
const handleClick = (categoryId: string) => {
    const href = qs.stringifyUrl({
        url: "/search",
        query: {
            categoryId: categoryId || undefined,
        },
    });
    router.push(href);
}
    return (
        <Card className="flex items-center gap-2 p-2 text-muted-foreground
hover:text-blue-700 hover:border-blue-500 hover: shadow-md
cursor-pointer" onClick={()=> handleClick(data.id)}>
<Icon name={data.name as IconName}/>
<span className='w-28 truncate whitespace-nowrap'>{data.name}</span>
<ChevronRight className='w-4 h-4'/>
</Card>
    )
}

export const HomeScreenCategoriesContainer= ({categories,}: HomeScreenCategoriesContainerProps) => {
  return (
    <Box className='flex-col mt-12'>
        <div className='w-full flex flex-wrap items-center justify-center gap-4'>
            {categories.map(item => (
                <CategoryListItemCard key={item.id} data={item}/>
            ))}
        </div>
    </Box>
  )
}
