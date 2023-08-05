import { ChangeEvent, KeyboardEvent } from "react";

import { IconSVG } from "../svgs/IconSVG.tsx";

export function SearchField({ idPrefix, type, handleSearch }: {
    idPrefix: string,
    type: "MEET" | "SESSION" | "POOL" | "TEAM" | "EVENT" | "SWIMMER"
    | "INDIVIDUAL_ENTRY_OF_SWIMMER" | "INDIVIDUAL_ENTRY_OF_EVENT"
    | "RELAY_ENTRY_OF_SWIMMER" | "RELAY_ENTRY_OF_EVENT"
    handleSearch: () => void,
}) {
    // * catch non-return key-up events
    function preCheckReturn(event: KeyboardEvent) {
        if (event.code === "Enter") {
            handleSearch();
        }
    }

    // * define numeric field validator
    function handleNumericFieldChange(event: ChangeEvent) {
        const numericFieldValue = (event.target as HTMLInputElement).value;
        if (!/^[0-9]*$/.test(numericFieldValue)) {
            (event.target as HTMLInputElement).value = numericFieldValue.substring(0, numericFieldValue.length - 1);
        }
    }

    switch (type) {
        case "MEET":
            return (
                <>
                    <div className="flex flex-row p-0 gap-x-0 items-stretch">
                        <input id={`${idPrefix}-name-search-field`} className="peer w-[200px] px-1 text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="Meet name" onKeyUp={preCheckReturn} />
                        <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 hover:bg-slate-200 border-slate-400 peer-focus:border-sky-400 hover:dark:bg-slate-700 dark:border-slate-500 peer-focus:dark:border-blue-500 border-l-0">
                            <IconSVG icon="FILTER" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                        </button>
                    </div>
                </>
            );

        case "SESSION":
            return (
                <>
                    <div className="flex flex-row p-0 gap-x-0 items-stretch">
                        <input id={`${idPrefix}-name-search-field`} className="peer w-[200px] px-1 text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="Session name" onKeyUp={preCheckReturn} />
                        <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 hover:bg-slate-200 border-slate-400 peer-focus:border-sky-400 hover:dark:bg-slate-700 dark:border-slate-500 peer-focus:dark:border-blue-500 border-l-0">
                            <IconSVG icon="FILTER" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                        </button>
                    </div>
                </>
            );

        case "POOL":
            return (
                <div className="group flex flex-row p-0 gap-x-0 items-stretch" tabIndex={0}>
                    <input id={`${idPrefix}-name-search-field`} className="w-[150px] px-1 text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Pool name" onKeyUp={preCheckReturn} />
                    <input id={`${idPrefix}-lanes-search-field`} className="w-[50px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Lanes" onKeyUp={preCheckReturn} onChange={handleNumericFieldChange} />
                    <input id={`${idPrefix}-length-search-field`} className="w-[50px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Length" onKeyUp={preCheckReturn} onChange={handleNumericFieldChange} />
                    <input id={`${idPrefix}-units-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="Units" onKeyUp={preCheckReturn} />
                    <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 focus-within:bg-slate-200 border-slate-400 group-focus-within:border-sky-400 focus-within:dark:bg-slate-700 dark:border-slate-500 group-focus:dark:border-blue-500 border-l-0">
                        <IconSVG icon="FILTER" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                    </button>
                </div>
            );

        case "TEAM":
            return (
                <>
                    <div className="group flex flex-row p-0 gap-x-0 items-stretch" tabIndex={0}>
                        <input id={`${idPrefix}-name-search-field`} className="w-[200px] px-1 text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Team name" onKeyUp={preCheckReturn} />
                        <input id={`${idPrefix}-acronym-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="Acronym" onKeyUp={preCheckReturn} />
                        <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 focus-within:bg-slate-200 border-slate-400 group-focus-within:border-sky-400 focus-within:dark:bg-slate-700 dark:border-slate-500 group-focus:dark:border-blue-500 border-l-0">
                            <IconSVG icon="FILTER" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                        </button>
                    </div>
                </>
            );

        case "EVENT":
            return (
                <>
                    <div className="group flex flex-row p-0 gap-x-0 items-stretch" tabIndex={0}>
                        <input id={`${idPrefix}-stroke-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Stroke" onKeyUp={preCheckReturn} />
                        <input id={`${idPrefix}-distance-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Distance" onKeyUp={preCheckReturn} onChange={handleNumericFieldChange} />
                        <input id={`${idPrefix}-min_age-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Min age" onKeyUp={preCheckReturn} onChange={handleNumericFieldChange} />
                        <input id={`${idPrefix}-max_age-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Max age" onKeyUp={preCheckReturn} onChange={handleNumericFieldChange} />
                        <input id={`${idPrefix}-gender-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="Gender" onKeyUp={preCheckReturn} />
                        <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 focus-within:bg-slate-200 border-slate-400 group-focus-within:border-sky-400 focus-within:dark:bg-slate-700 dark:border-slate-500 group-focus:dark:border-blue-500 border-l-0">
                            <IconSVG icon="FILTER" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                        </button>
                    </div>
                </>
            );

        case "SWIMMER":
            return (
                <>
                    <div className="group flex flex-row p-0 gap-x-0 items-stretch" tabIndex={0}>
                        <input id={`${idPrefix}-first_name-search-field`} className="w-[150px] px-1 text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="First name" onKeyUp={preCheckReturn} />
                        <input id={`${idPrefix}-last_name-search-field`} className="w-[150px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Last name" onKeyUp={preCheckReturn} />
                        <input id={`${idPrefix}-age-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Age" onKeyUp={preCheckReturn} onChange={handleNumericFieldChange} />
                        <input id={`${idPrefix}-gender-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="Gender" onKeyUp={preCheckReturn} />
                        <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 focus-within:bg-slate-200 border-slate-400 group-focus-within:border-sky-400 focus-within:dark:bg-slate-700 dark:border-slate-500 group-focus:dark:border-blue-500 border-l-0">
                            <IconSVG icon="FILTER" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                        </button>
                    </div>
                </>
            );

        case "INDIVIDUAL_ENTRY_OF_SWIMMER":
            return (
                <>
                    <div className="group flex flex-row p-0 gap-x-0 items-stretch" tabIndex={0}>
                        <input id={`${idPrefix}-stroke-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Stroke" onKeyUp={preCheckReturn} />
                        <input id={`${idPrefix}-distance-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="Distance" onKeyUp={preCheckReturn} onChange={handleNumericFieldChange} />
                        <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 focus-within:bg-slate-200 border-slate-400 group-focus-within:border-sky-400 focus-within:dark:bg-slate-700 dark:border-slate-500 group-focus:dark:border-blue-500 border-l-0">
                            <IconSVG icon="FILTER" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                        </button>
                    </div>
                </>
            );

        case "INDIVIDUAL_ENTRY_OF_EVENT":
            return (
                <>
                    <div className="group flex flex-row p-0 gap-x-0 items-stretch" tabIndex={0}>
                        <input id={`${idPrefix}-first_name-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="First name" onKeyUp={preCheckReturn} />
                        <input id={`${idPrefix}-last_name-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="Last name" onKeyUp={preCheckReturn} />
                        <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 focus-within:bg-slate-200 border-slate-400 group-focus-within:border-sky-400 focus-within:dark:bg-slate-700 dark:border-slate-500 group-focus:dark:border-blue-500 border-l-0">
                            <IconSVG icon="FILTER" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                        </button>
                    </div>
                </>
            );

        case "RELAY_ENTRY_OF_SWIMMER":
            return (
                <>
                    <div className="group flex flex-row p-0 gap-x-0 items-stretch" tabIndex={0}>
                        <input id={`${idPrefix}-stroke-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Stroke" onKeyUp={preCheckReturn} />
                        <input id={`${idPrefix}-distance-search-field`} className="w-[100px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black border-r-0" type="text" placeholder="Distance" onKeyUp={preCheckReturn} onChange={handleNumericFieldChange} />
                        <input id={`${idPrefix}-team_names-search-field`} className="w-[200px] px-1 text-lg rounded-md rounded-l-none rounded-r-none border-2 border-slate-400 dark:border-slate-500 group-focus-within:border-sky-400 group-focus-within:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="Swimmer name(s)" onKeyUp={preCheckReturn} />
                        <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 focus-within:bg-slate-200 border-slate-400 group-focus-within:border-sky-400 focus-within:dark:bg-slate-700 dark:border-slate-500 group-focus:dark:border-blue-500 border-l-0">
                            <IconSVG icon="FILTER" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                        </button>
                    </div>
                </>
            );

        case "RELAY_ENTRY_OF_EVENT":
            return (
                <>
                    <div className="flex flex-row p-0 gap-x-0 items-stretch">
                        <input id={`${idPrefix}-team_names-search-field`} className="peer w-[200px] px-1 text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="Swimmer name(s)" onKeyUp={preCheckReturn} />
                        <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 hover:bg-slate-200 border-slate-400 peer-focus:border-sky-400 hover:dark:bg-slate-700 dark:border-slate-500 peer-focus:dark:border-blue-500 border-l-0">
                            <IconSVG icon="FILTER" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                        </button>
                    </div>
                </>
            );
            
        // ! should never occur
        default:
            return (
                <>
                    <div className="flex flex-row p-0 gap-x-0 items-stretch">
                        <input id={`${idPrefix}-search-field`} className="peer w-[300px] px-1 text-lg rounded-md rounded-r-none border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="Search" onKeyUp={preCheckReturn} />
                        <button type="button" onClick={handleSearch} className="rounded-md rounded-l-none p-0.5 border-2 hover:bg-slate-200 border-slate-400 peer-focus:border-sky-400 hover:dark:bg-slate-700 dark:border-slate-500 peer-focus:dark:border-blue-500 border-l-0">
                            <IconSVG icon="FILTER" color="fill-slate-400 dark:fill-slate-500" width="w-[25px]" height="h-[25px]" />
                        </button>
                    </div>
                </>
            )
    }
}