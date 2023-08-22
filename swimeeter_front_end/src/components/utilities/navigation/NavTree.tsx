import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import type { NavTreeItem } from '../../../App';
import { AppContext } from '../../../App';
import { IconSVG } from '../svgs/IconSVG';

// ~ component
export function NavTree() {
    // * initialize context
    const { navTreeState, interpretedScreenMode }: {
        navTreeState: NavTreeItem[],
        interpretedScreenMode: "light" | "dark"
    } = useContext(AppContext);

    // * create formatted tree elements
    const formattedNavTreeItems: JSX.Element[] = []
    for (const item of navTreeState) {
        // * add link
        formattedNavTreeItems.push(
            <Link to={item.route} className="whitespace-nowrap text-slate-400 dark:text-slate-500 hover:text-sky-400 hover:dark:text-blue-500 text-xl">
                {item.title}
            </Link>
        )
        // * add arrow
        formattedNavTreeItems.push(
            <IconSVG icon="ARROW_RIGHT" color={interpretedScreenMode === "dark" ? "fill-slate-500" : "fill-slate-400"} width="w-[20px]" height="h-[20px]" />
        )
    }

    // * avoid rendering on home page
    if (formattedNavTreeItems.length === 0) {
        return <></>;
    }
    formattedNavTreeItems.pop() // remove extra end arrow
    
    // * scroll to end of nav tree
    useEffect(() => {
        const navTreeEndElement = document.getElementById("nav-tree-end") as HTMLDivElement;
        const navTreeDivElement = document.getElementById("nav-tree-div") as HTMLDivElement;

        navTreeDivElement.scrollLeft = navTreeEndElement.offsetLeft;
    }, [navTreeState]);

    return (
        <>
            <div className="h-7"></div>
            <div className="flex flex-row justify-center">
                <div className="w-[95%] relative rounded-md border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 py-1">
                    <div className="flex flex-row items-center gap-x-7 overflow-x-auto no-scrollbar" id="nav-tree-div">
                        <div className="w-0" id="nav-tree-start"></div>
                        {formattedNavTreeItems}
                        <div className="w-0" id="nav-tree-end"></div>
                    </div>
                    <div className="absolute z-5 left-0 top-0 h-full w-8 bg-gradient-to-r rounded-md from-slate-100 dark:from-slate-800"></div>
                    <div className="absolute z-5 right-0 top-0 h-full w-8 bg-gradient-to-l rounded-md from-slate-100 dark:from-slate-800"></div>
                </div>
            </div>
            <div className="h-7"></div>
        </>
    )
}