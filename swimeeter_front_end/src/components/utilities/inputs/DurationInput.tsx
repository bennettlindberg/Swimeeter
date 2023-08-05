import { useState } from "react";

export function DurationInput({
    defaultHour, 
    defaultMinute, 
    defaultSecond, 
    defaultDecimal, 
    idPrefix
}: {
    defaultHour?: string,
    defaultMinute?: string,
    defaultSecond?: string,
    defaultDecimal?: string,
    idPrefix: string
}) {
    // * initialize state variables
    const [inputHourText, setInputHourText] = useState<string>(defaultHour || "");
    const [inputMinuteText, setInputMinuteText] = useState<string>(defaultMinute || "");
    const [inputSecondText, setInputSecondText] = useState<string>(defaultSecond || "");
    const [inputDecimalText, setInputDecimalText] = useState<string>(defaultDecimal || "");

    // * define onChange event handler
    function handleHourChange(event: any) {
        if (/^$|^0?[0-9]$|^[0-9]{2}$/.test(event.target.value)) {
            setInputHourText(event.target.value)
        }
    }

    function handleMinuteChange(event: any) {
        if (/^$|^0?[0-9]$|^[12345][0-9]$/.test(event.target.value)) {
            setInputMinuteText(event.target.value)
        }
    }

    function handleSecondChange(event: any) {
        if (/^$|^0?[0-9]$|^[12345][0-9]$/.test(event.target.value)) {
            setInputSecondText(event.target.value)
        }
    }

    function handleDecimalChange(event: any) {
        if (/^$|^0?[0-9]$|^[0-9]{2}$/.test(event.target.value)) {
            setInputDecimalText(event.target.value)
        }
    }

    return (
        <>
            <div className="flex flex-row items-center gap-x-1">
                <input id={`${idPrefix}-hour-field`} className="max-w-[40px] px-1 text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="HH" value={inputHourText} onChange={handleHourChange}/>
                <p className="text-lg font-semibold">:</p>
                <input id={`${idPrefix}-minute-field`} className="max-w-[40px] px-1 text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="MM" value={inputMinuteText} onChange={handleMinuteChange}/>
                <p className="text-lg font-semibold">:</p>
                <input id={`${idPrefix}-second-field`} className="max-w-[40px] px-1 text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="SS" value={inputSecondText} onChange={handleSecondChange}/>
                <p className="text-lg font-semibold">.</p>
                <input id={`${idPrefix}-decimal-field`} className="max-w-[40px] px-1 text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder="DD" value={inputDecimalText} onChange={handleDecimalChange}/>
            </div>
        </>
    )
}