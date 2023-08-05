import { useState } from "react";
import { SearchSelect } from "./SearchSelect";

export function DateTimeInput({ 
    defaultHour, 
    defaultMinute,
    defaultDay,
    defaultMonth,
    defaultYear,
    idPrefix
}: {
    defaultHour?: string,
    defaultMinute?: string,
    defaultDay?: string,
    defaultMonth?: string,
    defaultYear?: string,
    idPrefix: string
}) {
    // * initialize state variables
    const [inputHourText, setInputHourText] = useState<string>(defaultHour || "");
    const [inputMinuteText, setInputMinuteText] = useState<string>(defaultMinute || "");
    const [inputDayText, setInputDayText] = useState<string>(defaultDay || "");
    const [inputYearText, setInputYearText] = useState<string>(defaultYear || "");
    
    // * define onChange event handlers
    function handleDayChange(event: any) {
        if (/^$|^[012]?[0-9]$|^3[01]$/.test(event.target.value)) {
            setInputDayText(event.target.value)
        }
    }

    function handleYearChange(event: any) {
        if (/^([0-9]?){4}$/.test(event.target.value)) {
            setInputYearText(event.target.value)
        }
    }

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
                <SearchSelect idPrefix={`${idPrefix}-month`} pixelWidth={100} regex={/^[A-Za-z]*$/} otherEnabled={false} placeholderText="Month" defaultText={defaultMonth || ""} options={[
                    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                ]} />
                <p className="w-[5px] text-lg font-semibold"></p>
                <input id={`${idPrefix}-day-field`} className="max-w-[40px] px-1 text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="DD" value={inputDayText} onChange={handleDayChange} />
                <p className="w-[5px] text-lg font-semibold"></p>
                <input id={`${idPrefix}-year-field`} className="max-w-[80px] px-1 text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="YYYY" value={inputYearText} onChange={handleYearChange} />
                <p className="w-[5px] text-lg font-semibold"></p>
                <input id={`${idPrefix}-hour-field`} className="max-w-[40px] px-1 text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="HH" value={inputHourText} onChange={handleHourChange}/>
                <p className="text-lg font-semibold">:</p>
                <input id={`${idPrefix}-minute-field`} className="max-w-[40px] px-1 text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="MM" value={inputMinuteText} onChange={handleMinuteChange}/>
                <p className="w-[5px] text-lg font-semibold"></p>
                <SearchSelect idPrefix={`${idPrefix}-AMPM`} pixelWidth={40} regex={/^$|^[AP]$|^[AP]M$/} otherEnabled={false} defaultText="AM" options={["AM", "PM"]} />
            </div>
        </>
    )
}