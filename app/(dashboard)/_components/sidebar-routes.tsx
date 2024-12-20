"use client";
import { BookMarked, Compass, Home, List, User } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { SideBarRouteItem } from "./side-bar-route-item";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { CheckBoxContainer } from "./checkbox-container";
import qs from "query-string"
import Box from "@/components/ui/box";


const adminRoutes = [
    {
        icon: List,
        label: "Jobs",
        href: "/admin/jobs",
    },
    {
        icon: List,
        label: "Companies",
        href: "/admin/companies",
    },
    {
        icon: Compass,
        label: "Analytics",
        href: "/admin/analytics",
    },
];

const guestRoutes = [
    {
        icon: Home,
        label: "Home",
        href: "/",
    },
    {
        icon: Compass,
        label: "Search",
        href: "/search",
    },
    {
        icon: User,
        label: "Profile",
        href: "/user",
    },
    {
        icon: BookMarked,
        label: "Saved Jobs",
        href: "/savedJobs",
    },
];

const shiftTimingsData = [
    {
      value: "full-time",
      label: "Full Time",
    },
    {
      value: "internship",
      label: "Internship",
    },
    {
      value: "contract",
      label: "Contract",
    },
];
const workingModesData = [
    {
      value: "remote",
      label: "Remote",
    },
    {
      value: "hybrid",
      label: "Hybrid",
    },
    {
      value: "office",
      label: "Office",
    },
];
  
// const experienceData = [
//     {
//       value: "0",
//       label: "Fresher",
//     },
//     {
//       value: "2",
//       label: "0-2 years",
//     },
//     {
//       value: "3",
//       label: "2-4 years",
//     },
//     {
//       value: "5",
//       label: "5+ years",
//     },
// ];

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Wait for client-side rendering
    }, []);

    

    const isAdminPage = pathname?.startsWith("/admin");
    const isSearchPage = pathname?.startsWith("/search");

    const routes = isAdminPage ? adminRoutes : guestRoutes;

    const handleShiftTimingChange = (shiftTimings: any[])=>{
        const currentQueryParams= qs.parseUrl(window.location.href).query;
        const updatedQueryParams ={
            ...currentQueryParams,
            shiftTiming: shiftTimings
        }

        const url = qs.stringifyUrl({
            url:pathname,
            query:updatedQueryParams
        },{
            skipNull:true,
            skipEmptyString:true
        })
        router.push(url)
    }

    const handleWorkingModes = (workModes: any[])=>{
        const currentQueryParams= qs.parseUrl(window.location.href).query;
        const updatedQueryParams ={
            ...currentQueryParams,
            workMode: workModes
        }

        const url = qs.stringifyUrl({
            url:pathname,
            query:updatedQueryParams
        },{
            skipNull:true,
            skipEmptyString:true,
            arrayFormat:"comma"
        })
        router.push(url)
    }

    // const handleExperience = (experience: any[])=>{
    //     const currentQueryParams= qs.parseUrl(window.location.href).query;
    //     const updatedQueryParams ={
    //         ...currentQueryParams,
    //         yearsOfExperience: experience
    //     }

    //     const url = qs.stringifyUrl({
    //         url:pathname,
    //         query:updatedQueryParams
    //     },{
    //         skipNull:true,
    //         skipEmptyString:true,
    //         arrayFormat:"comma"
    //     })
    //     router.push(url)
    // }

    if (!isClient) {
        return null; // Prevent rendering before client-side hydration
    }

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SideBarRouteItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}

            {isSearchPage && (
                <Box className="px-4 py-4 space-y-4 items-start justify-start flex-col">
                    <Separator/>
                    <h2 className="text-lg text-muted-foreground tracking-wide">Filters</h2>

                    {/*filter the data by createdAt*/}
                    {/* <DateFilter/> */}

                    <Separator/>
                    <h2  className="text-lg text-muted-foreground tracking-wide">Working Schedule</h2>

                    <CheckBoxContainer data={shiftTimingsData} onChange={handleShiftTimingChange}/>

                    <Separator/>
                    <h2  className="text-lg text-muted-foreground tracking-wide">Working Mode</h2>

                    <CheckBoxContainer data={workingModesData} onChange={handleWorkingModes}/>

                    {/* <Separator/>
                    <h2  className="text-lg text-muted-foreground tracking-wide">Experience</h2>

                    <CheckBoxContainer data={experienceData} onChange={handleExperience}/> */}

                </Box>
                
            )}
        </div>
    );
};
