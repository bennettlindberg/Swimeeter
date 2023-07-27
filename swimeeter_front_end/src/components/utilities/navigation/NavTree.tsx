import { useContext } from 'react';
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
            <Link to={item.route} className="text-slate-400 dark:text-slate-500 hover:text-sky-400 hover:dark:text-blue-500 text-xl">
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
        return <></>
    }
    formattedNavTreeItems.pop() // remove extra end arrow

    return (
        <>
            <div className="h-7"></div>
            <div className="flex flex-row justify-center">
                <div className="w-[95%] rounded-md border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 py-1">
                    <div className="flex flex-row flex-wrap items-center gap-x-7">
                        <div className="w-0"></div>
                        {formattedNavTreeItems}
                        <div className="w-0"></div>
                    </div>
                </div>
            </div>
            <div className="h-7"></div>
        </>
    )
}