"use client"

import {ResponsiveContainer, Tooltip, PieChart, Cell, Pie} from "recharts"

interface DataItem {
    name: string;
    value: number;
  }
  
  interface OverviewPieChartProps {
    data: DataItem[];  // Use the defined type here for the data prop
  }

const BLUE_COLORS = [
    "#0000FF", // Blue
    "#0000CD", // Medium Blue
    "#1E90FF", // Dodger Blue
    "#4169E1", // Royal Blue
    "#4682B4", // Steel Blue
    "#5F9EA0", // Cadet Blue
    "#6495ED", // Cornflower Blue
    "#7B68EE", // Medium Slate Blue
    "#87CEEB", // Sky Blue
    "#4682B4", // Steel Blue
    "#00008B", // Dark Blue
  ];

  
  export const OverviewPieChart = ({data}: OverviewPieChartProps) => {
    const filterData = data.filter(item => item.value !== 0)
    console.log(data);
   return (
    <ResponsiveContainer width={"100%"} height={350}>
        <PieChart>
            <Pie 
                data={filterData}
                dataKey={"value"}
                nameKey={"name"}
                cx={"50%"}
                cy={"50%"}
                innerRadius={60}
                outerRadius={8}
                fill="82ca9d"
                label={({name,value})=> `${name}: ${value}`}
            >

            {data.map((entry,index )=>(
                    <Cell
                        key={`cell-${index}`}
                        fill={BLUE_COLORS[index% BLUE_COLORS.length]}
                    />

            ))}
            </Pie>
            <Tooltip/>
        </PieChart>
    </ResponsiveContainer>
   )
  }
  