import { SearchSelect } from "./SearchSelect";
import { TextInput } from "./TextInput";
import { MainContentText } from "../main_content/MainContentText";
import { useEffect, useState } from "react";

export function DateTimeInput({
    defaults,
    rawTimeString,
    idPrefix
}: {
    defaults?: {
        hours?: string,
        minutes?: string,
        day?: string,
        month?: string,
        year?: string,
        AMPM?: string
    },
    rawTimeString?: string,
    idPrefix: string
}) {
    // * initialize state variables
    const [inputMonth, setInputMonth] = useState<string>((defaults && defaults.month) || "");
    const [inputDay, setInputDay] = useState<string>((defaults && defaults.day) || "");
    const [inputYear, setInputYear] = useState<string>((defaults && defaults.year) || "");
    const [inputHours, setInputHours] = useState<string>((defaults && defaults.hours) || "");
    const [inputMinutes, setInputMinutes] = useState<string>((defaults && defaults.minutes) || "");
    const [inputAMPM, setInputAMPM] = useState<string>((defaults && defaults.AMPM) || "AM");
    const [inputDateTime, setInputDateTime] = useState<string>("");

    // * define onChange event handlers
    function handleChangeMonth(month: string) {
        const monthConversions: { [key: string]: string } = {
            January: "01",
            February: "02",
            March: "03",
            April: "04",
            May: "05",
            June: "06",
            July: "07",
            August: "08",
            September: "09",
            October: "10",
            November: "11",
            December: "12"
        };

        setInputMonth(monthConversions[month] || "");
    }

    function handleChangeDay(day: string) {
        let formattedDay = day;

        if (formattedDay.length === 1) {
            formattedDay = "0" + formattedDay;
        }

        setInputDay(formattedDay || "");
    }

    function handleChangeYear(year: string) {
        setInputYear(year || "");
    }

    function handleChangeHours(hours: string) {
        setInputHours(hours || "");
    }

    function handleChangeMinutes(minutes: string) {
        setInputMinutes(minutes || "");
    }

    function handleChangeAMPM(AMPM: string) {
        setInputAMPM(AMPM || "");
    }

    // * define inputDateTime formatter
    useEffect(() => {
        if (!inputMonth || !inputDay || !inputYear || !inputHours || !inputMinutes || !inputAMPM) {
            setInputDateTime("");
        }

        let adjustedHours = inputHours;
        try {
            if (inputAMPM === "PM" && inputHours !== "12") {
                adjustedHours = "" + (parseInt(inputHours) + 12);
            } else if (inputAMPM === "AM" && inputHours === "12") {
                adjustedHours = "00";
            }
        } catch {
            // * error adjusting hours
            setInputDateTime("");
        }

        // * produce UTC offset string
        let UTCOffsetString = "";
        const rawOffsetMinutes = new Date().getTimezoneOffset();

        UTCOffsetString += rawOffsetMinutes > 0 ? "-" : "+";

        const offsetHours = Math.floor(Math.abs(rawOffsetMinutes) / 60);
        UTCOffsetString += (offsetHours < 10 ? "0" : "") + offsetHours + ":";

        const offsetMinutes = Math.abs(rawOffsetMinutes) % 60;
        UTCOffsetString += (offsetMinutes < 10 ? "0" : "") + offsetMinutes;

        setInputDateTime(`${inputYear}-${inputMonth}-${inputDay}T${adjustedHours}:${inputMinutes}${UTCOffsetString}`);
    }, [inputMonth, inputDay, inputYear, inputHours, inputMinutes, inputAMPM]);

    return (
        <>
            <input className="hidden" type="text" value={inputDateTime} id={idPrefix + "-datetime-field"}/>

            <input className="hidden peer/edit" id={idPrefix + "-datetime-field-edit"}/>
            <div className="peer-read-only/edit:hidden flex flex-row items-center gap-x-1">
                <SearchSelect
                    idPrefix={`${idPrefix}-month`}
                    pixelWidth={115}
                    regex={/^[A-Za-z]*$/}
                    otherEnabled={false}
                    placeholderText="Month"
                    defaultText={(defaults && defaults.month) || ""}
                    options={[
                        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                    ]}
                    exteriorHandleChange={handleChangeMonth}
                />
                <TextInput
                    idPrefix={`${idPrefix}-day`}
                    pixelWidth={45}
                    regex={/^$|^[123456789]$|^1[0-9]$|^2[0-9]$|^3[01]$/}
                    placeholderText="Day"
                    defaultText={(defaults && defaults.day) || ""}
                    exteriorHandleChange={handleChangeDay}
                />
                <MainContentText>,</MainContentText>
                <TextInput
                    idPrefix={`${idPrefix}-year`}
                    pixelWidth={60}
                    regex={/^$|^[123456789][0-9]*$/}
                    placeholderText="Year"
                    defaultText={(defaults && defaults.year) || ""}
                    exteriorHandleChange={handleChangeYear}
                />
                <MainContentText>at</MainContentText>
                <TextInput
                    idPrefix={`${idPrefix}-hours`}
                    pixelWidth={45}
                    regex={/^$|^[123456789]$|^1[012]$/}
                    placeholderText="HH"
                    defaultText={(defaults && defaults.hours) || ""}
                    exteriorHandleChange={handleChangeHours}
                />
                <MainContentText>:</MainContentText>
                <TextInput
                    idPrefix={`${idPrefix}-minutes`}
                    pixelWidth={45}
                    regex={/^$|^[012345][0-9]?$/}
                    placeholderText="mm"
                    defaultText={(defaults && defaults.minutes) || ""}
                    exteriorHandleChange={handleChangeMinutes}
                />
                <SearchSelect
                    idPrefix={`${idPrefix}-AMPM`}
                    pixelWidth={45}
                    regex={/^$|^[AP]$|^[AP]M$/}
                    otherEnabled={false}
                    defaultText={(defaults && defaults.AMPM) || "AM"}
                    options={[
                        "AM", "PM"
                    ]}
                    exteriorHandleChange={handleChangeAMPM}
                />
            </div>

            <input className="hidden peer/view" id={idPrefix + "-datetime-field-view"}/>
            <p className="peer-read-only/view:hidden w-[300px] text-lg px-1 rounded-md border-2 border-slate-400 dark:border-slate-500 focus:border-slate-400 focus:dark:border-slate-500 focus:outline-none bg-slate-100 dark:bg-slate-800">
                {rawTimeString}
            </p>
        </>
    )
}