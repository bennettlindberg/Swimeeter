import { useState } from "react";

import { IconSVG } from "../svgs/IconSVG.tsx";
import { TableGrid } from "../tables/TableGrid.tsx";

// ~ component
export function HeatSheetHeader({
    color,
    title,
    indicator,
    children
}: {
    color: "orange" | "purple" | "slate" | "primary",
    title: string,
    indicator?: JSX.Element,
    children: React.ReactNode
}) {
    // * initialize state and navigation
    const [isOpen, setIsOpen] = useState<boolean>(true);

    let interpretedButtonColor = "";
    let interpretedTextColor = "";
    let interpretedFillColor = "";
    switch (color) {
        case "orange":
            interpretedButtonColor = "bg-orange-100 group-hover:bg-orange-200 border-orange-200 dark:bg-orange-900 group-hover:dark:bg-orange-800 dark:border-orange-800";
            interpretedTextColor = "text-orange-400 dark:text-orange-500"
            interpretedFillColor = "fill-orange-400 dark:fill-orange-500"
            break;

        case "purple":
            interpretedButtonColor = "bg-purple-100 group-hover:bg-purple-200 border-purple-200 dark:bg-purple-900 group-hover:dark:bg-purple-800 dark:border-purple-800";
            interpretedTextColor = "text-purple-400 dark:text-purple-500"
            interpretedFillColor = "fill-purple-400 dark:fill-purple-500"
            break;

        case "slate":
            interpretedButtonColor = "bg-slate-100 group-hover:bg-slate-200 border-slate-200 dark:bg-slate-800 group-hover:dark:bg-slate-700 dark:border-slate-700";
            interpretedTextColor = "text-slate-400 dark:text-slate-500"
            interpretedFillColor = "fill-slate-400 dark:fill-slate-500"
            break;

        case "primary":
            interpretedButtonColor = "bg-sky-100 group-hover:bg-sky-200 border-sky-200 dark:bg-blue-900 group-hover:dark:bg-blue-800 dark:border-blue-800";
            interpretedTextColor = "text-sky-400 dark:text-blue-500"
            interpretedFillColor = "fill-sky-400 dark:fill-blue-500"
            break;
    }

    return (
        <>
            <TableGrid>
                <colgroup>
                    <col span={1} className="w-auto" />
                    <col span={1} className="w-7" />
                </colgroup>

                <thead className={`group py-1 font-semibold text-xl ${interpretedButtonColor} ${interpretedTextColor}`} onClick={() => setIsOpen(!isOpen)}>
                    <td className={`first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 ${interpretedButtonColor}`}>
                        <div className="flex flex-row gap-x-2 items-center">
                            {indicator}
                            {title}
                        </div>
                    </td>
                    <td className={`first-of-type:rounded-l-md last-of-type:rounded-r-md border-t-2 border-b-2 first-of-type:border-l-2 last-of-type:border-r-2 ${interpretedButtonColor}`}>
                        {
                            isOpen
                                ? <IconSVG icon="ARROW_DOWN" color={interpretedFillColor} width="w-[20px]" height="h-[20px]" />
                                : <IconSVG icon="ARROW_RIGHT" color={interpretedFillColor} width="w-[20px]" height="h-[20px]" />
                        }
                    </td>
                </thead>

                {isOpen && children}
            </TableGrid>
        </>
    )
}