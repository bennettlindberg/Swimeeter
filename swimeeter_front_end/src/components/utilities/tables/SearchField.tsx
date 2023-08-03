import { KeyboardEvent } from "react";

import { IconSVG } from "../svgs/IconSVG.tsx";

export function SearchField({ idPrefix, placeholderText, handleSearch }: {
    idPrefix: string,
    placeholderText?: string,
    handleSearch: () => void,
}) {
    // * catch non-return key-up events
    function preCheckReturn(event: KeyboardEvent) {
        if (event.code === "Enter") {
            handleSearch();
        }
    }

    return (
        <>
            <div className="flex flex-row p-0 gap-x-0 items-stretch">
                <input id={`${idPrefix}-search-field`} className="peer w-[300px] text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder={placeholderText} onKeyUp={preCheckReturn} />
                <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 p hover:bg-slate-200 border-slate-400 peer-focus:border-sky-400 hover:dark:bg-slate-700 dark:border-slate-500 peer-focus:dark:border-blue-500 border-l-0">
                    <IconSVG icon="EARTH_GLOBE" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                </button>
            </div>
        </>
    )
}