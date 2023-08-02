import { KeyboardEvent } from "react";

export function SearchField({ idPrefix, placeholderText, handleReturn }: {
    idPrefix: string,
    placeholderText?: string,
    handleReturn: () => void
}) {
    // * catch non-return key-up events
    function preCheckReturn(event: KeyboardEvent) {
        if (event.code === "Enter") {
            handleReturn();
        }
    }

    return (
        <>
            <input id={`${idPrefix}-search-field`} className="w-[300px] text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder={placeholderText} onKeyUp={preCheckReturn} />
        </>
    )
}