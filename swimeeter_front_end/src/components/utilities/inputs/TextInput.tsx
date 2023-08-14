import { useEffect, useState } from "react";

export function TextInput({
    regex,
    placeholderText,
    defaultText,
    pixelWidth,
    idPrefix,
    isPassword,
    exteriorHandleChange
}: {
    regex: RegExp,
    placeholderText?: string,
    defaultText?: string
    pixelWidth: number,
    idPrefix: string,
    isPassword?: boolean,
    exteriorHandleChange?: (input: any) => void
}) {
    // * initialize state variables
    const [inputText, setInputText] = useState<string>(defaultText || "");

    // * define onChange event handler
    function handleChange(event: any) {
        if (regex.test(event.target.value)) {
            setInputText(event.target.value)
        }
    }

    // * execute exteriorHandleChange when input changes
    useEffect(() => {
        if (exteriorHandleChange) {
            exteriorHandleChange(inputText);
        }
    }, [inputText]);

    // * update state if DOM doesn't change
    useEffect(() => setInputText(defaultText || ""), [defaultText])

    return (
        <>
            <input id={`${idPrefix}-text-field`} className="text-lg px-1 rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 read-only:focus:border-slate-400 read-only:focus:dark:border-slate-500 focus:outline-none bg-white dark:bg-black read-only:bg-slate-100 read-only:dark:bg-slate-800" type={isPassword ? "password" : "text"} placeholder={placeholderText} value={inputText} onChange={handleChange} style={{ width: `${pixelWidth}px` }} />
        </>
    )
}