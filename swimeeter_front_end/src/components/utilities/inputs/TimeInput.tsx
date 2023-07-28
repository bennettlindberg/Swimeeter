import { useState } from "react";
import { SearchSelect } from "./SearchSelect";

export function TimeInput({defaultHour, defaultMinute, idPrefix}: {
    defaultHour?: string,
    defaultMinute?: string,
    idPrefix: string
}) {
    // * initialize state variables
    const [inputHourText, setInputHourText] = useState<string>(defaultHour || "");
    const [inputMinuteText, setInputMinuteText] = useState<string>(defaultMinute || "");

    // * define onChange event handlers
    function handleHourChange(event: any) {
        if (/^$|^0?[0-9]$|^1[012]$/.test(event.target.value)) {
            setInputHourText(event.target.value)
        }
    }

    function handleMinuteChange(event: any) {
        if (/^$|^0?[0-9]$|^[12345][0-9]$/.test(event.target.value)) {
            setInputMinuteText(event.target.value)
        }
    }

    return (
        <>
            <div className="flex flex-row items-center gap-x-1">
                <input id={`${idPrefix}-hour-field`} className="max-w-[40px] text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="HH" value={inputHourText} onChange={handleHourChange}/>
                <p className="text-lg font-semibold">:</p>
                <input id={`${idPrefix}-minute-field`} className="max-w-[40px] text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="MM" value={inputMinuteText} onChange={handleMinuteChange}/>
                <p className="w-[5px] text-lg font-semibold"></p>
                <SearchSelect idPrefix={`${idPrefix}-AMPM`} pixelWidth={40} regex={/^$|^[AP]$|^[AP]M$/} otherEnabled={false} defaultText="AM" options={["AM", "PM"]} />
            </div>
        </>
    )
}