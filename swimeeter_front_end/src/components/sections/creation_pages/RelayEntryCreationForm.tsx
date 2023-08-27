import { useEffect, useId, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { DestructiveType, DuplicateType, ErrorType } from "../../utilities/helpers/formTypes.ts";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { FormContext } from "../../utilities/helpers/formHelpers.ts"
import { TextInput } from "../../utilities/inputs/TextInput.tsx";
import { DurationInput } from "../../utilities/inputs/DurationInput.tsx";
import { RelayEntryModelSelect } from "../../utilities/inputs/RelayEventModelSelect.tsx";
import { RelaySwimmerModelSelect } from "../../utilities/inputs/RelaySwimmerModelSelect.tsx";

import { DataForm } from "../../utilities/forms/DataForm.tsx";
import { ErrorPane } from "../../utilities/forms/ErrorPane.tsx";
import { DuplicatePane } from "../../utilities/forms/DuplicatePane.tsx";
import { DestructivePane } from "../../utilities/forms/DestructivePane.tsx";
import { NeutralFormGroup } from "../../utilities/forms/NeutralFormGroup.tsx";
import { CreationFormGroup } from "../../utilities/forms/CreationFormGroup.tsx";
import { MainContentText } from "../../utilities/main_content/MainContentText.tsx";

// * define form types
type FormState = {
    error: ErrorType | null,
    duplicate: DuplicateType | null,
    destructive: DestructiveType | null
}

type FormAction = {
    type: "SAVE_SUCCESS" | "DISMISS_ERROR" | "DISMISS_DUPLICATE_PANE" | "DISMISS_DESTRUCTIVE_PANE"
} | {
    type: "SAVE_FAILURE",
    error: ErrorType
} | {
    type: "TRIGGER_DUPLICATE_PANE",
    duplicate: DuplicateType
} | {
    type: "TRIGGER_DESTRUCTIVE_PANE",
    destructive: DestructiveType
}

// * define form reducer
function formReducer(state: FormState, action: FormAction) {
    switch (action.type) {
        case "SAVE_SUCCESS":
            return {
                error: null,
                duplicate: null,
                destructive: null,
            } as FormState;

        case "DISMISS_ERROR":
            return {
                ...state,
                error: null,
            } as FormState;

        case "SAVE_FAILURE":
            return {
                ...state,
                duplicate: null,
                destructive: null,
                error: action.error,
            } as FormState;

        case "TRIGGER_DUPLICATE_PANE":
            return {
                ...state,
                destructive: null,
                duplicate: action.duplicate
            } as FormState;

        case "DISMISS_DUPLICATE_PANE":
            return {
                ...state,
                duplicate: null
            } as FormState;

        case "TRIGGER_DESTRUCTIVE_PANE":
            return {
                ...state,
                duplicate: null,
                destructive: action.destructive
            } as FormState;

        case "DISMISS_DESTRUCTIVE_PANE":
            return {
                ...state,
                destructive: null,
            } as FormState;

        default:
            return state;
    }
}

// * define error possibilities
const errorPossibilities = [
    {
        matchString: "user is not logged in",
        error: {
            title: "AUTHORIZATION ERROR",
            description: "You are not currently logged into an account. Log into an account before creating a relay entry for this meet.",
            recommendation: "Log into an account using the log in button found in the navigation bar."
        }
    },
    {
        matchString: "user is not logged into meet host account",
        error: {
            title: "AUTHORIZATION ERROR",
            description: "You are not currently logged into the host account for this meet. Log into the host account before creating a relay entry for this meet.",
            recommendation: "Log into the host account using the log in button found in the navigation bar."
        }
    },
    {
        matchString: "no event_id query parameter passed",
        error: {
            title: "EVENT FIELD ERROR",
            description: "No event matching the event name provided in the event field exists. Every relay entry must be associated with a event.",
            recommendation: "Choose an existing event for the relay entry to be associated with. If no events exist, first add an event to the meet."
        }
    },
    {
        matchString: "no Event with the given id exists",
        error: {
            title: "EVENT FIELD ERROR",
            description: "No event matching the event name provided in the event field exists. Every relay entry must be associated with a event.",
            recommendation: "Choose an existing event for the relay entry to be associated with. If no events exist, first add an event to the meet."
        }
    },
    {
        matchString: "swimmers and event are incompatible",
        error: {
            title: "SWIMMERS AND EVENT COMPATIBILITY ERROR",
            description: "At least one of the selected swimmers is incompatible with the selected event for this relay entry. All of the entry's swimmers must meet the event's competitor demographic requirements.",
            recommendation: "Choose swimmers and an event for the relay entry such that the swimmers' ages and genders are compatible with the event's competing age range and gender."
        }
    }
];

// ~ component
export function RelayEntryCreationForm({ meet_id_INT, scrollRef }: { meet_id_INT: number, scrollRef: React.RefObject<HTMLHeadingElement> }) {
    // * initialize location
    const location = useLocation();
    let defaultSwimmer: { name: string, swimmer_id: number } | undefined = undefined;
    try {
        defaultSwimmer = location.state.defaultSwimmer;
    } catch {
        defaultSwimmer = undefined;
    }
    let defaultEvent: { name: string, swimmers_per_entry: number, event_id: number } | undefined = undefined;
    try {
        defaultEvent = location.state.defaultEvent;
    } catch {
        defaultEvent = undefined;
    }

    // * initialize state and navigation
    const [formState, formDispatch] = useReducer(formReducer, {
        error: null,
        duplicate: null,
        destructive: null,
    });
    const [eventSelection, setEventSelection] = useState<{
        name: string;
        swimmers_per_entry: number;
        event_id: number;
    }>(defaultEvent || {
        name: "",
        swimmers_per_entry: -1,
        event_id: -1
    });
    const [assignments, setAssignments] = useState<{
        swimmer_id: number,
        swimmer_name: string
        order_in_relay: number,
        seed_relay_split: number
    }[]>([
        {
            swimmer_id: defaultSwimmer ? defaultSwimmer.swimmer_id : -1,
            swimmer_name: defaultSwimmer ? defaultSwimmer.name : "",
            order_in_relay: 1,
            seed_relay_split: -1
        }
    ]);
    const navigate = useNavigate();

    // * initialize id
    const idPrefix = useId();

    // * disable read-only inputs
    useEffect(() => {
        for (const formInputSuffix of ["-seed_time-text-field", "-heat_number-text-field", "-lane_number-text-field"]) {
            const inputElement = document.getElementById(idPrefix + formInputSuffix) as HTMLInputElement;
            inputElement.readOnly = true;
        }

        // ! disable "view" version of datetime and duration fields
        for (let i = 0; i < assignments.length; ++i) {
            const viewElement = document.getElementById(`${idPrefix}-${i}-seed_split_time-duration-field-view`) as HTMLInputElement;
            viewElement.readOnly = true;
        }
    }, [assignments.length]);

    // * define form handlers
    function handleSwimmerSelection(selectedIndex: number, selection: {
        text: string,
        model_id: number
    }) {
        if (selection.model_id === -1 || selection.model_id === assignments[selectedIndex].swimmer_id) {
            return;
        }

        setAssignments(assignments.map((assignment, mapIndex) => {
            if (mapIndex !== selectedIndex) {
                return assignment;
            } else {
                return {
                    ...assignment,
                    swimmer_id: selection.model_id,
                    swimmer_name: selection.text
                }
            }
        }));
    }

    function handleEventSelection(selection: {
        text: string,
        swimmers_per_entry: number,
        model_id: number
    }) {
        if (selection.model_id === -1 || selection.model_id === eventSelection.event_id) {
            return;
        }

        setEventSelection({
            name: selection.text,
            swimmers_per_entry: selection.swimmers_per_entry,
            event_id: selection.model_id
        });

        if (selection.swimmers_per_entry < assignments.length) {
            setAssignments(assignments.slice(0, selection.swimmers_per_entry));
        } else {
            const assignmentsToAdd = [];
            const oldAssignmentsLength = assignments.length;
            for (let i = 0; i < selection.swimmers_per_entry - assignments.length; ++i) {
                assignmentsToAdd.push({
                    swimmer_id: -1,
                    swimmer_name: "",
                    order_in_relay: i + oldAssignmentsLength + 1,
                    seed_relay_split: -1
                });
            }
            setAssignments([
                ...assignments,
                ...assignmentsToAdd
            ]);
        }
    }

    function handleDuplicateSelection(duplicate_handling: "keep_new" | "keep_both" | "cancel") {
        if (duplicate_handling === "keep_new") {
            formDispatch({
                type: "TRIGGER_DESTRUCTIVE_PANE",
                destructive: {
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Replacing previously-created duplicate entries with this one will result in the deletion of the original entries. Are you sure you want to continue?",
                    impact: "All relay entries in the selected event containing at least one of the selected swimmers will be replaced with this new entry.",
                    type: "duplicate_keep_new"
                }
            });
        } else if (duplicate_handling === "keep_both") {
            handleSubmit(duplicate_handling);
        } else {
            formDispatch({
                type: "DISMISS_DUPLICATE_PANE"
            });
        }
    }

    function handleDestructiveSelection(
        selection: "continue" | "cancel",
        context: "duplicate_keep_new" | "destructive_submission" | "destructive_deletion" | "unknown",
        duplicate_handling?: "unhandled" | "keep_new" | "keep_both"
    ) {
        if (selection === "continue") {
            switch (context) {
                case "duplicate_keep_new":
                    handleSubmit(duplicate_handling);
                    break;

                case "destructive_submission":
                    handleSubmit(duplicate_handling, true);
                    break;

                // ! should never occur
                default:
                    navigate("errors/unknown");
            }
        } else {
            formDispatch({
                type: "DISMISS_DESTRUCTIVE_PANE"
            });
        }
    }

    async function handleSubmit(duplicate_handling?: "unhandled" | "keep_new" | "keep_both", bypassDestructiveSubmission?: boolean) {
        scrollRef.current?.scrollIntoView();

        // ~ submit counts as destructive action -> show destructive pop-up
        if (!bypassDestructiveSubmission) {
            formDispatch({
                type: "TRIGGER_DESTRUCTIVE_PANE",
                destructive: {
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Creating a new relay entry will trigger the invalidation and deletion of the associated event's seeding. Are you sure you want to continue?",
                    impact: "The associated event's heat sheet seeding will be permanently deleted.",
                    type: "destructive_submission"
                }
            });
            return;
        }

        // * ensure event model selected
        if (eventSelection.event_id === -1
            || eventSelection.event_id === undefined) {
            // ? invalid event model selection
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: `EVENT FIELD ERROR`,
                    description: `The event field was provided an invalid value. The event field must be provided the name of a valid event in this meet.`,
                    recommendation: `Alter the provided event value to conform to the requirements of the event field.`
                }
            });
        }

        // * retrieve raw data
        let formData: {
            seed_time: number,
            assignments: {
                swimmer_id: number,
                seed_relay_split: number,
                order_in_relay: number
            }[]
        } = {
            seed_time: -1,
            assignments: []
        }

        try {
            let cumulative_seed_time = 0;

            for (let i = 0; i < assignments.length; ++i) {
                const split_seed_time = parseInt((document.getElementById(`${idPrefix}-${i}-seed_split_time-duration-field`) as HTMLInputElement).value);
                cumulative_seed_time += split_seed_time;

                formData.assignments.push({
                    swimmer_id: assignments[i].swimmer_id,
                    seed_relay_split: split_seed_time,
                    order_in_relay: assignments[i].order_in_relay
                })
            }

            formData.seed_time = cumulative_seed_time;
        } catch (error) {
            // ? data retrieval error
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "UNKNOWN ERROR",
                    description: "An unknown error ocurred while attempting to submit the form."
                }
            });
            return;
        }

        // @ send new model data to the back-end
        try {
            const response = await axios.post(
                "/api/v1/relay_entries/",
                formData,
                {
                    params: {
                        duplicate_handling: duplicate_handling || "unhandled",
                        event_id: eventSelection.event_id
                    }
                }
            );

            formDispatch({
                type: "SAVE_SUCCESS"
            });

            navigate(`/meets/${meet_id_INT}/relay_entries/${response.data.pk}`);
        } catch (error) {
            // ? back-end error
            if (axios.isAxiosError(error)) {
                const errorTitle = error.response?.data;

                // ~ duplicates exist that need to be handled
                if (errorTitle === "unhandled duplicates exist") {

                    formDispatch({
                        type: "TRIGGER_DUPLICATE_PANE",
                        duplicate: {
                            title: "UNHANDLED DUPLICATE ENTRIES EXIST",
                            description: "A relay entry in the selected event with at least of the selected swimmers exists in your account. How would you like to resolve the duplicate data conflict?",
                            keep_both: false,
                            keep_new: true,
                        }
                    });
                    return;
                }

                // ~ iterate over passed error possibilities
                for (const errorPossibility of errorPossibilities) {
                    if (errorTitle === errorPossibility.matchString) {
                        formDispatch({
                            type: "SAVE_FAILURE",
                            error: errorPossibility.error
                        });
                        return;
                    }
                }

                formDispatch({
                    type: "SAVE_FAILURE",
                    error: {
                        title: "UNKNOWN ERROR",
                        description: "An unknown error ocurred while attempting to submit the form."
                    }
                });
                return;

            } else {
                formDispatch({
                    type: "SAVE_FAILURE",
                    error: {
                        title: "UNKNOWN ERROR",
                        description: "An unknown error ocurred while attempting to submit the form."
                    }
                });
                return;
            }
        }
    }

    return (
        <DataForm>
            {formState.error && <ErrorPane error={formState.error} handleXClick={() => formDispatch({ type: "DISMISS_ERROR" })} />}
            {formState.duplicate && <DuplicatePane handleClick={handleDuplicateSelection} info={formState.duplicate} />}
            {formState.destructive && <DestructivePane handleClick={handleDestructiveSelection} info={formState.destructive} />}

            <FormContext.Provider value={true}>
                <NeutralFormGroup
                    label={<InputLabel inputId={idPrefix + "-seed_time-text-field"} text="Seed time" />}
                    key={idPrefix + "-seed_time-text-field"}
                    field={<TextInput
                        regex={/^.*$/}
                        placeholderText="N/A"
                        pixelWidth={300}
                        idPrefix={idPrefix + "-seed_time"}
                    />}
                    baseInfo={{
                        title: "SEED TIME",
                        description: "The seed time field contains the seed time of the relay entry being created. The value of this field is read-only as it is determined automatically by summing each relay participant's seed split time.",
                    }}
                />
                <NeutralFormGroup
                    label={<InputLabel inputId={idPrefix + "-heat_number-text-field"} text="Heat number" />}
                    key={idPrefix + "-heat_number-text-field"}
                    field={<TextInput
                        regex={/^.*$/}
                        placeholderText="N/A"
                        pixelWidth={300}
                        idPrefix={idPrefix + "-heat_number"}
                    />}
                    baseInfo={{
                        title: "HEAT NUMBER",
                        description: "The heat number field contains the heat of the entry's seed placement. The value of this field is read-only as it is determined automatically by generating the heat sheet seeding for the entry's associated event.",
                    }}
                />
                <NeutralFormGroup
                    label={<InputLabel inputId={idPrefix + "-lane_number-text-field"} text="Lane number" />}
                    key={idPrefix + "-lane_number-text-field"}
                    field={<TextInput
                        regex={/^.*$/}
                        placeholderText="N/A"
                        pixelWidth={300}
                        idPrefix={idPrefix + "-lane_number"}
                    />}
                    baseInfo={{
                        title: "LANE NUMBER",
                        description: "The lane number field contains the lane of the entry's seed placement. The value of this field is read-only as it is determined automatically by generating the heat sheet seeding for the entry's associated event.",
                    }}
                />

                <RelayEntryModelSelect
                    idPrefix={idPrefix}
                    meet_id_INT={meet_id_INT}
                    type="creating"
                    defaultSelection={{
                        text: eventSelection.name,
                        swimmers_per_entry: eventSelection.swimmers_per_entry,
                        model_id: eventSelection.event_id
                    }}
                    setModelSelection={(selection: {
                        text: string,
                        swimmers_per_entry: number,
                        model_id: number
                    }) => handleEventSelection(selection)}
                />

                {assignments.map((assignment, mapIndex) => {
                    return (
                        <div className="flex flex-col gap-y-2 p-2 rounded-md border-2 odd:bg-slate-50 even:bg-transparent odd:dark:bg-slate-800 even:dark:bg-transparent border-slate-200 dark:border-slate-700">
                            <MainContentText>
                                {`Leg #${mapIndex + 1}`}
                            </MainContentText>
                            <CreationFormGroup
                                label={<InputLabel inputId={`${idPrefix}-${mapIndex}-seed_split_time-duration-field`} text="Seed split time" />}
                                key={`${idPrefix}-${mapIndex}-seed_split_time-duration-field`}
                                optional={false}
                                field={<DurationInput
                                    idPrefix={`${idPrefix}-${mapIndex}-seed_split_time`}
                                />}
                                createInfo={{
                                    title: "SEED SPLIT TIME",
                                    description: "The seed split time field should contain the seed time of this relay leg. Usually, this is the fastest time previously swam by the chosen swimmer in the event matching the leg being swam.",
                                    permitted_values: "Any valid non-zero duration. Any subsection may be left blank if zero of the specified time increments are required to represent the duration."
                                }}
                            />
                            <RelaySwimmerModelSelect
                                idPrefix={idPrefix + "-" + mapIndex}
                                meet_id_INT={meet_id_INT}
                                type="creating"
                                defaultSelection={{
                                    text: assignments[mapIndex].swimmer_name,
                                    model_id: assignments[mapIndex].swimmer_id
                                }}
                                setModelSelection={(selection: {
                                    text: string,
                                    model_id: number
                                }) => handleSwimmerSelection(mapIndex, selection)}
                            />
                        </div>
                    )
                })}
            </FormContext.Provider>

            <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text="Create relay entry" type="submit" handleClick={(event: any) => {
                event.preventDefault();
                handleSubmit();
            }} />
        </DataForm>
    )
}