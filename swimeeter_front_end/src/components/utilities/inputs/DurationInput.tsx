import { TextInput } from "./TextInput";
import { MainContentText } from "../main_content/MainContentText";
import { useEffect, useState } from "react";

export function DurationInput({
    defaults,
    rawDurationString,
    rawDurationNumber,
    idPrefix
}: {
    defaults?: {
        hours: string,
        minutes: string,
        seconds: string,
        decimal: string,
    },
    rawDurationString?: string,
    rawDurationNumber?: number,
    idPrefix: string
}) {
    // * initialize state variables
    const [inputHours, setInputHours] = useState<string>((defaults && defaults.hours) || "");
    const [inputMinutes, setInputMinutes] = useState<string>((defaults && defaults.minutes) || "");
    const [inputSeconds, setInputSeconds] = useState<string>((defaults && defaults.seconds) || "");
    const [inputDecimal, setInputDecimal] = useState<string>((defaults && defaults.decimal) || "");
    const [inputDuration, setInputDuration] = useState<number>(rawDurationNumber || 0);

    // * define inputDuration formatter
    useEffect(() => {
        let hundredths = 0;

        const multipleOfHundredth: {[key: string]: number} = {
            hours: 100 * 60 * 60,
            minutes: 100 * 60,
            seconds: 100,
            decimal: 1
        }

        const inputAmounts: {[key: string]: string} = {
            hours: inputHours,
            minutes: inputMinutes,
            seconds: inputSeconds,
            decimal: inputDecimal
        }

        for (const inputKey in inputAmounts) {
            const amountString = inputAmounts[inputKey];
            try {
                if (amountString) {
                    const amountInt = parseInt(amountString);
                    hundredths += amountInt * multipleOfHundredth[inputKey];
                }
            } catch {
                continue;
            }
        }

        setInputDuration(hundredths);
    }, [inputHours, inputMinutes, inputSeconds, inputDecimal]);

    return (
        <>
            <input className="hidden" type="text" value={inputDuration} id={idPrefix + "-duration-field"} />

            <input className="hidden peer/edit" id={idPrefix + "-duration-field-edit"} />
            <div className="peer-read-only/edit:hidden flex flex-row items-center gap-x-1">
                <TextInput
                    idPrefix={`${idPrefix}-hours`}
                    pixelWidth={45}
                    regex={/^[0-9]?[0-9]?$/}
                    placeholderText="HH"
                    defaultText={(defaults && defaults.hours) || ""}
                    exteriorHandleChange={(hours: string) => setInputHours(hours)}
                />
                <MainContentText>:</MainContentText>
                <TextInput
                    idPrefix={`${idPrefix}-minutes`}
                    pixelWidth={45}
                    regex={/^$|^[0-9]$|^[012345][0-9]$/}
                    placeholderText="mm"
                    defaultText={(defaults && defaults.minutes) || ""}
                    exteriorHandleChange={(minutes: string) => setInputMinutes(minutes)}
                />
                <MainContentText>:</MainContentText>
                <TextInput
                    idPrefix={`${idPrefix}-seconds`}
                    pixelWidth={45}
                    regex={/^$|^[0-9]$|^[012345][0-9]$/}
                    placeholderText="ss"
                    defaultText={(defaults && defaults.seconds) || ""}
                    exteriorHandleChange={(seconds: string) => setInputSeconds(seconds)}
                />
                <MainContentText>.</MainContentText>
                <TextInput
                    idPrefix={`${idPrefix}-decimal`}
                    pixelWidth={45}
                    regex={/^[0-9]?[0-9]?$/}
                    placeholderText="SS"
                    defaultText={(defaults && defaults.decimal) || ""}
                    exteriorHandleChange={(decimal: string) => setInputDecimal(decimal)}
                />
            </div>

            <input className="hidden peer/view" id={idPrefix + "-duration-field-view"} />
            <p className="peer-read-only/view:hidden w-[300px] text-lg px-1 rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-slate-400 focus:dark:border-slate-500 focus:outline-none bg-slate-100 dark:bg-slate-800">
                {rawDurationString}
            </p>
        </>
    )
}