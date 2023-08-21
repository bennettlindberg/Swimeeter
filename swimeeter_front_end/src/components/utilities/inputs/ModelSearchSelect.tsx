import { useState, useId, useEffect } from "react";

// ~ component
export function ModelSearchSelect({
    regex,
    otherEnabled,
    placeholderText,
    defaultSelection,
    pixelWidth,
    options,
    setModelSelection,
    idPrefix
}: {
    regex: RegExp,
    otherEnabled: boolean,
    placeholderText?: string,
    defaultSelection?: {
        text: string,
        model_id: number
    },
    pixelWidth: number,
    options: {
        text: string,
        model_id: number
    }[],
    setModelSelection: (selection: {
        text: string,
        model_id: number
    }) => void,
    idPrefix: string
}) {
    // * initialize state variables
    const [inputSelection, setInputSelection] = useState<{
        text: string,
        model_id: number
    }>({
        text: defaultSelection ? defaultSelection.text : "",
        model_id: defaultSelection ? defaultSelection.model_id : -1
    });
    const [matchingOptions, setMatchingOptions] = useState<{
        text: string,
        model_id: number
    }[]>([]);
    const [optionsShown, setOptionsShown] = useState<boolean>(false);

    // * initialize id prefix
    const internalIdPrefix = useId();

    // * define onChange event handler
    function handleChange(event: any) {
        // * ensure following input regex
        if (regex.test(event.target.value)) {
            setInputSelection({
                ...inputSelection,
                text: event.target.value
            });
        }

        // * determine matching options to display
        const tempMatchingOptions = [];

        const lowercaseInput: string = event.target.value.toLowerCase()
        const inputRegex = new RegExp(lowercaseInput);

        for (const option of options) {
            const lowercaseOption = option.text.toLowerCase();

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
        let matchOption = {
            text: "",
            model_id: -1
        };

        for (const option of options) {
            const lowercaseOption = option.text.toLowerCase();

            const maybeMatch = lowercaseOption.match(inputRegex);
            if (maybeMatch && maybeMatch.length > maxLengthMatch) {
                maxLengthMatch = maybeMatch.length;
                matchOption = option;
            }
        }

        if (maxLengthMatch > 0) {
            setInputSelection(matchOption);
            setModelSelection(matchOption);
        } else {
            setInputSelection(defaultSelection || options[0]);
            setModelSelection(defaultSelection || options[0]);
        }
    }

    // * update state if DOM doesn't change
    useEffect(() => {
        setInputSelection(defaultSelection || {
            text: "",
            model_id: -1
        });
        setModelSelection(defaultSelection || {
            text: "",
            model_id: -1
        });
    }, [defaultSelection]);

    return (
        <>
            <div className="flex flex-col gap-y-0">
                <input id={`${idPrefix}-model-select-field`} className="peer text-lg px-1 rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-sky-400 focus:dark:border-blue-500 read-only:focus:border-slate-400 read-only:focus:dark:border-slate-500 focus:outline-none bg-white dark:bg-black read-only:bg-slate-100 read-only:dark:bg-slate-800" type="text" placeholder={placeholderText} value={inputSelection.text} onChange={handleChange} onFocus={handleGainFocus} onBlur={handleLostFocus} style={{ width: `${pixelWidth}px` }} />
                <div className="relative peer-read-only:invisible">
                    <div className={`${optionsShown && matchingOptions.length > 0 ? "visible" : "invisible"} bg-white dark:bg-black border-2 border-slate-200 dark:border-slate-700 flex flex-col items-start rounded-md absolute left-0 top-0 p-2 z-10`}>
                        {matchingOptions.map((option, index) => {
                            return <button
                                className={`hover:bg-slate-200 dark:hover:bg-slate-700 ${option.model_id === inputSelection.model_id ? "bg-sky-100 dark:bg-blue-900" : "bg-transparent"} text-black dark:text-white rounded-md p-1 w-full text-lg text-left`}
                                key={internalIdPrefix + "-" + index}
                                id={internalIdPrefix + "-" + index}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    setInputSelection(option);
                                    setModelSelection(option);
                                    setOptionsShown(false);
                                }}>
                                {option.text}
                            </button>
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}