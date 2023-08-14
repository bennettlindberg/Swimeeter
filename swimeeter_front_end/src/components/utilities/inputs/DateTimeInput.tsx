import { SearchSelect } from "./SearchSelect";
import { TextInput } from "./TextInput";
import { MainContentText } from "../main_content/MainContentText";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    // * initialize navigation
    const navigate = useNavigate();

    // * initialize state variables
    const [inputMonth, setInputMonth] = useState<string>("");
    const [inputDay, setInputDay] = useState<string>("");
    const [inputYear, setInputYear] = useState<string>("");
    const [inputHour, setInputHour] = useState<string>("");
    const [inputMinute, setInputMinute] = useState<string>("");
    const [inputAMPM, setInputAMPM] = useState<string>("");
    const [inputDateTime, setInputDateTime] = useState<string>("");

    // * define onChange event handlers
    function handleChangeMonth(month: string) {
        const monthConversions: {[key: string]: string} = {
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

        // // * check date validity
        // if (inputDay && inputYear) {
        //     try {
        //         const testDate = new Date(`${inputYear}-${monthConversions[month]}-${inputDay}`);

        //         if (isNaN(testDate.getTime())) {
        //             setInputDay("");
        //             (document.getElementById(`${idPrefix}-day-text-field`) as HTMLInputElement).value = "";
        //         }
        //     } catch {
        //         navigate("/errors/unknown");
        //     }
        // }
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

    function handleChangeHour(hour: string) {
        setInputHour(hour || "");
    }

    function handleChangeMinute(minute: string) {
        setInputMinute(minute || "");
    }

    function handleChangeAMPM(AMPM: string) {
        setInputAMPM(AMPM || "");
    }

    // * define inputDateTime formatter
    useEffect(() => {
        if (!inputMonth || !inputDay || !inputYear || !inputHour || !inputMinute || !inputAMPM) {
            setInputDateTime("");
        }

        let adjustedHour = inputHour;
        try {
            if (inputAMPM === "PM" && inputHour !== "12") {
                adjustedHour = "" + (parseInt(inputHour) + 12);
            } else if (inputAMPM === "AM" && inputHour === "12") {
                adjustedHour = "00";
            }
        } catch {
            // * error adjusting hour
            setInputDateTime("");
        }

        setInputDateTime(`${inputYear}-${inputMonth}-${inputDay}T${adjustedHour}:${inputMinute}`);
    }, [inputMonth, inputDay, inputYear, inputHour, inputMinute, inputAMPM]);

    return (
        <>
            <div className="flex flex-row items-center gap-x-1">
                <div className="hidden">
                    <input type="text" value={inputDateTime} id={idPrefix + "-datetime-field"}/>
                </div>

                <SearchSelect
                    idPrefix={`${idPrefix}-month`}
                    pixelWidth={115}
                    regex={/^[A-Za-z]*$/}
                    otherEnabled={false}
                    placeholderText="Month"
                    defaultText={defaultMonth || ""}
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
                    defaultText={defaultDay || ""}
                    exteriorHandleChange={handleChangeDay}
                />
                <MainContentText>,</MainContentText>
                <TextInput
                    idPrefix={`${idPrefix}-year`}
                    pixelWidth={60}
                    regex={/^$|^[123456789][0-9]*$/}
                    placeholderText="Year"
                    defaultText={defaultYear || ""}
                    exteriorHandleChange={handleChangeYear}
                />
                <MainContentText>at</MainContentText>
                <TextInput
                    idPrefix={`${idPrefix}-hour`}
                    pixelWidth={45}
                    regex={/^$|^[123456789]$|^1[012]$/}
                    placeholderText="HH"
                    defaultText={defaultHour || ""}
                    exteriorHandleChange={handleChangeHour}
                />
                <MainContentText>:</MainContentText>
                <TextInput
                    idPrefix={`${idPrefix}-minute`}
                    pixelWidth={45}
                    regex={/^$|^[012345][0-9]?$/}
                    placeholderText="MM"
                    defaultText={defaultMinute || ""}
                    exteriorHandleChange={handleChangeMinute}
                />
                <SearchSelect
                    idPrefix={`${idPrefix}-AMPM`}
                    pixelWidth={45}
                    regex={/^$|^[AP]$|^[AP]M$/}
                    otherEnabled={false}
                    defaultText="AM"
                    options={[
                        "AM", "PM"
                    ]}
                    exteriorHandleChange={handleChangeAMPM}
                />
            </div>
        </>
    )
}