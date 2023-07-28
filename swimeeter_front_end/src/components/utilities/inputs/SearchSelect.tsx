import { useState, useId } from "react";

// ~ component
export function SearchSelect({ 
    regex, 
    otherEnabled, 
    placeholderText, 
    defaultText, 
    pixelWidth, 
    options, 
    idPrefix 
}: {
    //status: string, 
    regex: RegExp,
    otherEnabled: boolean,
    placeholderText?: string,
    defaultText?: string,
    pixelWidth: number,
    options: string[],
    idPrefix: string
}) {
    // * initialize state variables
    const [inputText, setInputText] = useState<string>(defaultText || "");
    const [matchingOptions, setMatchingOptions] = useState<string[]>([]);
    const [optionsShown, setOptionsShown] = useState<boolean>(false);

    // * initialize id prefix
    const internalIdPrefix = useId();

    // * define onChange event handler
    function handleChange(event: any) {
        // * ensure following input regex
        if (regex.test(event.target.value)) {
            setInputText(event.target.value)
        }

        // * determine matching options to display
        const tempMatchingOptions = [];

        const lowercaseInput: string = event.target.value.toLowerCase()
        const inputRegex = new RegExp(lowercaseInput);

        for (const option of options) {
            const lowercaseOption = option.toLowerCase();

            const maybeMatch = lowercaseOption.match(inputRegex);
            if (maybeMatch) {
                tempMatchingOptions.push(option);
            }
        }

        setMatchingOptions(tempMatchingOptions);
    }

    // * define onFocus event handler
    function handleGainFocus() {
        setOptionsShown(true);
    }

    // * define onBlur event handler
    function handleLostFocus(event: any) {
        // $ early return if non-standard input allowed
        if (otherEnabled) {
            return;
        }

        // $ ignore if clicked on drop down option
        if (event.relatedTarget && event.relatedTarget.id.split("-")[0] === internalIdPrefix) {
            return;
        }

        // $ otherwise change to closest standard input and close drop down
        setOptionsShown(false);

        const lowercaseInput: string = event.target.value.toLowerCase()
        const inputRegex = new RegExp(lowercaseInput);

        let maxLengthMatch = 0;
        let matchOptionStr = "";

        for (const option of options) {
            const lowercaseOption = option.toLowerCase();

            const maybeMatch = lowercaseOption.match(inputRegex);
            if (maybeMatch && maybeMatch.length > maxLengthMatch) {
                maxLengthMatch = maybeMatch.length;
                matchOptionStr = option;
            }
        }

        if (maxLengthMatch > 0) {
            setInputText(matchOptionStr);
        } else {
            setInputText(options[0]);
        }
    }

    return (
        <>
            <div className="flex flex-col gap-y-0">
                <input id={`${idPrefix}-select-field`} className="text-lg rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 focus:outline-none bg-white dark:bg-black" type="text" placeholder={placeholderText} value={inputText} onChange={handleChange} onFocus={handleGainFocus} onBlur={handleLostFocus} style={{width:`${pixelWidth}px`}}/>
                <div className="relative">
                    <div className={`${optionsShown && matchingOptions.length > 0 ? "visible" : "invisible"} bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-700 flex flex-col items-start rounded-md absolute left-0 top-0 p-2 z-10`}>
                        {matchingOptions.map((option, index) => {
                            return <button className={`hover:bg-slate-200 dark:hover:bg-slate-700 ${option === inputText ? "bg-sky-100 dark:bg-blue-900" : "bg-transparent"} text-black dark:text-white rounded-md p-1 w-full text-lg text-left`} id={internalIdPrefix + "-" + index} onClick={(event: any) => {
                                event.preventDefault();
                                setInputText(option);
                                setOptionsShown(false);
                            }}>
                                {option}
                            </button>
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}