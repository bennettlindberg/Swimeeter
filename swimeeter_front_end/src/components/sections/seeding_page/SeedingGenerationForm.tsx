import { useContext, useEffect, useId, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { Event, Session } from "../../utilities/helpers/modelTypes.ts";
import { DestructiveType, ErrorType } from "../../utilities/helpers/formTypes.ts";
import { OverviewHeatSheet } from "../../utilities/helpers/heatSheetTypes.ts";
import { SeedingContext } from "../../pages/seeding/SeedingPage.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { FormContext } from "../../utilities/helpers/formHelpers.ts"
import { TextInput } from "../../utilities/inputs/TextInput.tsx";

import { DataForm } from "../../utilities/forms/DataForm.tsx";
import { ErrorPane } from "../../utilities/forms/ErrorPane.tsx";
import { DestructivePane } from "../../utilities/forms/DestructivePane.tsx";
import { CreationFormGroup } from "../../utilities/forms/CreationFormGroup.tsx";
import { SearchSelect } from "../../utilities/inputs/SearchSelect.tsx";
import { ModelSearchSelect } from "../../utilities/inputs/ModelSearchSelect.tsx";
import { generateEventName } from "../../utilities/helpers/nameGenerators.ts";
import { NeutralFormGroup } from "../../utilities/forms/NeutralFormGroup.tsx";

// * define form types
type FormState = {
    error: ErrorType | null,
    destructive: DestructiveType | null
}

type FormAction = {
    type: "SAVE_SUCCESS" | "DISMISS_ERROR" | "DISMISS_DESTRUCTIVE_PANE"
} | {
    type: "SAVE_FAILURE",
    error: ErrorType
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
                destructive: null,
                error: action.error,
            } as FormState;

        case "TRIGGER_DESTRUCTIVE_PANE":
            return {
                ...state,
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
            description: "You are not currently logged into an account. Log into an account before generating seeding for this meet.",
            recommendation: "Log into an account using the log in button found in the navigation bar."
        }
    },
    {
        matchString: "user is not logged into meet host account",
        error: {
            title: "AUTHORIZATION ERROR",
            description: "You are not currently logged into the host account for this meet. Log into the host account before generating seeding for this meet.",
            recommendation: "Log into the host account using the log in button found in the navigation bar."
        }
    },
    {
        matchString: "no event_id query parameter passed",
        error: {
            title: "EVENT FIELD ERROR",
            description: "No event matching the event name provided in the event field exists.",
            fields: "Event",
            recommendation: "Choose an existing event for which to generate seeding. If no events exist, first add an event to the meet."
        }
    },
    {
        matchString: "no Event with the given id exists",
        error: {
            title: "EVENT FIELD ERROR",
            description: "No event matching the event name provided in the event field exists.",
            fields: "Event",
            recommendation: "Choose an existing event for which to generate seeding. If no events exist, first add an event to the meet."
        }
    },
    {
        matchString: "no session_id query parameter passed",
        error: {
            title: "SESSION FIELD ERROR",
            description: "No session matching the session name provided in the session field exists.",
            fields: "Session",
            recommendation: "Choose an existing session for which to generate seeding. If no sessions exist, first add a session to the meet."
        }
    },
    {
        matchString: "no Session with the given id exists",
        error: {
            title: "SESSION FIELD ERROR",
            description: "No session matching the session name provided in the session field exists.",
            fields: "Session",
            recommendation: "Choose an existing session for which to generate seeding. If no sessions exist, first add a session to the meet."
        }
    }
];

// ~ component
export function SeedingGenerationForm({ scrollRef }: { scrollRef: React.RefObject<HTMLHeadingElement> }) {
    // * initialize location
    const location = useLocation();
    let defaultTarget: { target_type: "meet" | "event" | "session", target_name: string, target_id: number } | undefined = undefined;
    try {
        defaultTarget = location.state.defaultTarget;
    } catch {
        defaultTarget = undefined;
    }

    // * initialize state and context
    const [formState, formDispatch] = useReducer(formReducer, {
        error: null,
        destructive: null,
    });

    const [modelSelection, setModelSelection] = useState<{
        text: string;
        model_id: number;
    }>((defaultTarget && defaultTarget.target_type !== "meet" && {
        text: defaultTarget.target_name,
        model_id: defaultTarget.target_id
    })
        || {
        text: "",
        model_id: -1
    });
    const [sessionChoices, setSessionChoices] = useState<{
        text: string,
        model_id: number
    }[]>([]);
    const [eventChoices, setEventChoices] = useState<{
        text: string,
        model_id: number
    }[]>([]);

    const [specificTo, setSpecificTo] = useState<"meet" | "session" | "event">((defaultTarget && defaultTarget.target_type) || "meet");
    const [seedingType, setSeedingType] = useState<"standard" | "circle">("standard");

    const { seedingData, setSeedingData }: {
        seedingData: OverviewHeatSheet,
        setSeedingData: React.Dispatch<React.SetStateAction<OverviewHeatSheet>>,
    } = useContext(SeedingContext);

    // * initialize id and navigation
    const navigate = useNavigate();
    const idPrefix = useId();

    // * ensure read-only for applicable inputs
    useEffect(() => {
        const modelSelectionElement = document.getElementById(idPrefix + "-model_name-model-select-field") as HTMLInputElement;
        if (specificTo === "meet") {
            modelSelectionElement.readOnly = true;
        } else {
            modelSelectionElement.readOnly = false;
        }
    }, [specificTo, seedingData]);

    // * retrieve session and event choices
    useEffect(() => {
        async function retrieveOptions() {
            try {
                // @ make call to back-end for event options data
                let response = await axios.get(
                    "/api/v1/events/",
                    {
                        params: {
                            specific_to: "meet",
                            event_type: "both",
                            meet_id: seedingData.meet_id
                        }
                    }
                );

                setEventChoices(response.data.map((option: Event) => {
                    return {
                        text: generateEventName(option),
                        model_id: option.pk
                    }
                }));

                // @ make call to back-end for session options data
                response = await axios.get(
                    "/api/v1/sessions/",
                    {
                        params: {
                            specific_to: "meet",
                            meet_id: seedingData.meet_id
                        }
                    }
                );

                setSessionChoices(response.data.map((option: Session) => {
                    return {
                        text: option.fields.name,
                        model_id: option.pk
                    }
                }));
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        retrieveOptions();

        // ! avoid loss of selection when options change
        setModelSelection(defaultTarget && {
            text: defaultTarget.target_name,
            model_id: defaultTarget.target_id
        } || {
            text: "",
            model_id: -1
        });
    }, [seedingData]);

    // * define form handlers
    function handleModelSelection(selection: {
        text: string,
        model_id: number
    }) {
        if (selection.model_id === -1 || selection.model_id === modelSelection.model_id) {
            return;
        }

        setModelSelection(selection);
    }

    function handleSpecificToSelection(selection: "Meet" | "Event" | "Session") {
        setModelSelection({
            text: "",
            model_id: -1
        });

        switch (selection) {
            case "Meet":
                setSpecificTo("meet");
                break;

            case "Event":
                setSpecificTo("event");
                break;

            case "Session":
                setSpecificTo("session");
                break;

            // ~ occurs when not finishing edit field value
            default:
                break;
        }
    }

    function handleSeedingTypeSelection(selection: "Standard" | "Circle") {
        switch (selection) {
            case "Standard":
                setSeedingType("standard");
                break;

            case "Circle":
                setSeedingType("circle");
                break;

            // ~ occurs when not finishing edit field value
            default:
                break;
        }
    }

    function handleDestructiveSelection(
        selection: "continue" | "cancel",
        context: "destructive_submission" | "unknown" | "duplicate_keep_new" | "destructive_deletion",
    ) {
        if (selection === "continue") {
            switch (context) {
                case "destructive_submission":
                    handleSubmit(true);
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

    async function handleSubmit(bypassDestructiveSubmission?: boolean) {
        scrollRef.current?.scrollIntoView();

        // ~ submit counts as destructive action -> show destructive pop-up
        if (!bypassDestructiveSubmission) {
            formDispatch({
                type: "TRIGGER_DESTRUCTIVE_PANE",
                destructive: {
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: `Generating new seeding for ${specificTo === "event" ? "an" : "a"} ${specificTo} will permanently override the ${specificTo}'s existing seeding, if any. Are you sure you want to continue?`,
                    impact: `The ${specificTo}'s heat sheet seeding will be permanently deleted.`,
                    type: "destructive_submission"
                }
            });
            return;
        }

        // * ensure model selected when applicable
        if (specificTo !== "meet" && (modelSelection.model_id === -1
            || modelSelection.model_id === undefined)) {
            // ? invalid model selection
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: `${specificTo.toUpperCase()} FIELD ERROR`,
                    description: `The ${specificTo} field was provided an invalid value. The ${specificTo} field must be provided the name of a valid ${specificTo} in this meet.`,
                    fields: specificTo === "event" ? "Event" : "Session",
                    recommendation: `Alter the provided ${specificTo} value to conform to the requirements of the ${specificTo} field.`
                }
            });
        }

        // * retrieve raw data
        let formData: {
            min_entries_per_heat: number,
            seeding_type: "standard" | "circle",
            num_circle_seeded_heats?: number | "All full heats"
        } = {
            min_entries_per_heat: -1,
            seeding_type: "standard"
        }

        try {
            const minEntriesField = document.getElementById(idPrefix + "-min_entries-text-field") as HTMLInputElement;
            const minEntriesValue = minEntriesField.value;
            if (minEntriesValue === "") {
                formDispatch({
                    type: "SAVE_FAILURE",
                    error: {
                        title: "MINIMUM ENTRIES PER HEAT FIELD ERROR",
                        description: "The minimum entries per heat field was left blank. Specifying the minimum entries per heat is required and must be a positive integer.",
                        fields: "Minimum entries per heat",
                        recommendation: "Alter the entered minimum entries per heat to conform to the requirements of the field."
                    }
                });
                return;
            } else if (parseInt(minEntriesValue) <= 0) {
                formDispatch({
                    type: "SAVE_FAILURE",
                    error: {
                        title: "MINIMUM ENTRIES PER HEAT FIELD ERROR",
                        description: "An invalid value was provided to the minimum entries per heat field. The specified minimum entries per heat must be a positive integer.",
                        fields: "Minimum entries per heat",
                        recommendation: "Alter the entered minimum entries per heat to conform to the requirements of the field."
                    }
                });
                return;
            }
            formData.min_entries_per_heat = parseInt(minEntriesValue);

            const seedingTypeField = document.getElementById(idPrefix + "-seeding_type-select-field") as HTMLInputElement;
            const seedingTypeValue = seedingTypeField.value;
            if (seedingTypeValue === "") {
                formDispatch({
                    type: "SAVE_FAILURE",
                    error: {
                        title: "SEEDING TYPE FIELD ERROR",
                        description: "The seeding type field was left blank. Specifying the seeding type is required and must be either \"Standard\" or \"Circle.\"",
                        fields: "Seeding type",
                        recommendation: "Alter the entered seeding type to conform to the requirements of the field."
                    }
                });
                return;
            } else if (seedingTypeValue !== "Standard" && seedingTypeValue !== "Circle") {
                formDispatch({
                    type: "SAVE_FAILURE",
                    error: {
                        title: "SEEDING TYPE FIELD ERROR",
                        description: "An invalid value was provided to the seeding type field. The specified seeding type must be either \"Standard\" or \"Circle.\"",
                        fields: "Seeding type",
                        recommendation: "Alter the entered seeding type to conform to the requirements of the field."
                    }
                });
                return;
            }
            formData.seeding_type = seedingTypeValue === "Circle" ? "circle" : "standard";

            if (formData.seeding_type === "circle") {
                const numCircledField = document.getElementById(idPrefix + "-num_circled-select-field") as HTMLInputElement;
                const numCircledValue = numCircledField.value;
                if (numCircledValue === "") {
                    formDispatch({
                        type: "SAVE_FAILURE",
                        error: {
                            title: "NUMBER OF CIRCLE-SEEDED HEATS FIELD ERROR",
                            description: "The number of circled-seeded heats field was left blank. Specifying the number of circle-seeded heats is required when using circle seeding and may be either \"All full heats\" or any positive integer.",
                            fields: "Number of circle-seeded heats",
                            recommendation: "Alter the entered number of circled-seeded heats to conform to the requirements of the field."
                        }
                    });
                    return;
                } else if (numCircledValue === "All full heats") {
                    formData.num_circle_seeded_heats = numCircledValue;
                } else if (/^[0-9]*$/.test(numCircledValue) && parseInt(numCircledValue) > 0) {
                    formData.num_circle_seeded_heats = parseInt(numCircledValue);
                } else {
                    formDispatch({
                        type: "SAVE_FAILURE",
                        error: {
                            title: "NUMBER OF CIRCLE-SEEDED HEATS FIELD ERROR",
                            description: "An invalid value was provided to the number of circled-seeded heats field. The specified number of circle-seeded heats may be either \"All full heats\" or any positive integer.",
                            fields: "Number of circle-seeded heats",
                            recommendation: "Alter the entered number of circled-seeded heats to conform to the requirements of the field."
                        }
                    });
                    return;
                }
            }
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
            const response = await axios.put(
                "/api/v1/heat_sheets/",
                formData,
                {
                    params: {
                        specific_to: specificTo,
                        event_id: specificTo === "event" ? modelSelection.model_id : -1,
                        session_id: specificTo === "session" ? modelSelection.model_id : -1,
                        meet_id: specificTo === "meet" ? seedingData.meet_id : -1
                    }
                }
            );

            setSeedingData(response.data);

            formDispatch({
                type: "SAVE_SUCCESS"
            });

            navigate(`/meets/${seedingData.meet_id}/seeding`);
        } catch (error) {
            // ? back-end error
            if (axios.isAxiosError(error)) {
                const errorTitle = error.response?.data;
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
            {formState.destructive && <DestructivePane handleClick={handleDestructiveSelection} info={formState.destructive} />}

            <FormContext.Provider value={true}>
                <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 items-end p-2 rounded-md border-2 odd:bg-slate-50 even:bg-transparent odd:dark:bg-slate-900 even:dark:bg-transparent border-slate-200 dark:border-slate-700">
                    <div className="max-w-min min-w-[300px]">
                        <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-specific_to-select-field"} text="Seeding target type" />}
                            field={<SearchSelect
                                idPrefix={idPrefix + "-specific_to"}
                                regex={/^(M(e(e(t?)?)?)?)?$|^(S(e(s(s(i(o(n?)?)?)?)?)?)?)?$|^(E(v(e(n(t?)?)?)?)?)?$/}
                                otherEnabled={false}
                                placeholderText="Seeding target type"
                                defaultText={specificTo === "meet" ? "Meet" : specificTo === "event" ? "Event" : "Session"}
                                options={[
                                    "Meet", "Session", "Event"
                                ]}
                                pixelWidth={300}
                                exteriorHandleChange={handleSpecificToSelection}
                            />}
                            createInfo={{
                                title: "SEEDING TARGET TYPE",
                                description: "The seeding target type field should contain the type for which the seeding will be generated.",
                                permitted_values: "\"Meet,\" \"Session,\" or \"Event.\""
                            }}
                            optional={false}
                        />
                    </div>
                    <div className="max-w-min min-w-[300px]">
                        {specificTo === "meet"
                            ? <NeutralFormGroup
                                label={<InputLabel inputId={idPrefix + "-model_name-model-select-field"} text="Meet target name" />}
                                field={<ModelSearchSelect
                                    idPrefix={idPrefix + "-model_name"}
                                    regex={/^.*$/}
                                    otherEnabled={false}
                                    placeholderText="Meet target name"
                                    pixelWidth={300}
                                    defaultSelection={{
                                        text: seedingData.meet_name,
                                        model_id: seedingData.meet_id
                                    }}
                                    setModelSelection={handleModelSelection}
                                    options={[
                                        { text: seedingData.meet_name, model_id: seedingData.meet_id }
                                    ]}
                                />}
                                baseInfo={{
                                    title: "MEET TARGET NAME",
                                    description: `The meet target name field contains the meet name for which the seeding will be generated. The value of the field is read-only as only the current meet's seeding can be generated on this page.`,
                                }}
                            />
                            : specificTo === "event"
                                ? <CreationFormGroup
                                    label={<InputLabel inputId={idPrefix + "-model_name-model-select-field"} text="Event target name" />}
                                    field={<ModelSearchSelect
                                        idPrefix={idPrefix + "-model_name"}
                                        regex={/^.*$/}
                                        otherEnabled={false}
                                        placeholderText="Event target name"
                                        pixelWidth={300}
                                        defaultSelection={modelSelection}
                                        setModelSelection={handleModelSelection}
                                        options={eventChoices}
                                    />}
                                    createInfo={{
                                        title: "EVENT TARGET NAME",
                                        description: "The event target name field should contain the event name for which the seeding will be generated.",
                                        permitted_values: "Any string."
                                    }}
                                    optional={false}
                                />
                                : <>
                                    {/* shift DOM to force options reload */}
                                    <div className="hidden"></div>
                                    <CreationFormGroup
                                        label={<InputLabel inputId={idPrefix + "-model_name-model-select-field"} text="Session target name" />}
                                        field={<ModelSearchSelect
                                            idPrefix={idPrefix + "-model_name"}
                                            regex={/^.*$/}
                                            otherEnabled={false}
                                            placeholderText="Session target name"
                                            pixelWidth={300}
                                            defaultSelection={modelSelection}
                                            setModelSelection={handleModelSelection}
                                            options={sessionChoices}
                                        />}
                                        createInfo={{
                                            title: "SESSION TARGET NAME",
                                            description: "The session target name field should contain the session name for which the seeding will be generated.",
                                            permitted_values: "Any string."
                                        }}
                                        optional={false}
                                    />
                                </>
                        }
                    </div>
                </div>

                <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 items-end p-2 rounded-md border-2 odd:bg-slate-50 even:bg-transparent odd:dark:bg-slate-900 even:dark:bg-transparent border-slate-200 dark:border-slate-700">
                    <div className="max-w-min min-w-[300px]">
                        <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-min_entries-text-field"} text="Minimum entries per heat" />}
                            field={<TextInput
                                idPrefix={idPrefix + "-min_entries"}
                                regex={/^([123456789][0-9]*)?$/}
                                placeholderText="Minimum entries per heat"
                                defaultText="3"
                                pixelWidth={300}
                            />}
                            createInfo={{
                                title: "MINIMUM ENTRIES PER HEAT",
                                description: "The minimum entries per heat field should contain the number of entries that each heat should contain at minimum.",
                                common_values: "3",
                                permitted_values: "Any positive integer.",
                                warning: "Swimeeter will attempt to satisfy the specified minimum entries per heat when generating the seeding. In some cases, however, doing so is not possible."
                            }}
                            optional={false}
                        />
                    </div>
                </div>

                <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 items-end p-2 rounded-md border-2 odd:bg-slate-50 even:bg-transparent odd:dark:bg-slate-900 even:dark:bg-transparent border-slate-200 dark:border-slate-700">
                    <div className="max-w-min min-w-[300px]">
                        <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-seeding_type-select-field"} text="Seeding method" />}
                            field={<SearchSelect
                                idPrefix={idPrefix + "-seeding_type"}
                                regex={/^(S(t(a(n(d(a(r(d?)?)?)?)?)?)?)?)?$|^(C(i(r(c(l(e?)?)?)?)?)?)?$/}
                                otherEnabled={false}
                                placeholderText="Seeding method"
                                defaultText="Standard"
                                options={[
                                    "Standard", "Circle"
                                ]}
                                pixelWidth={300}
                                exteriorHandleChange={handleSeedingTypeSelection}
                            />}
                            createInfo={{
                                title: "SEEDING METHOD",
                                description: "The seeding method field should contain the method for generating the seeding. Seeding methods determine how entries are organized into heats and lanes.",
                                permitted_values: "\"Standard\" or \"Circle.\""
                            }}
                            optional={false}
                        />
                    </div>
                    <div className="max-w-min min-w-[300px]">
                        {seedingType === "circle" &&
                            <CreationFormGroup
                                label={<InputLabel inputId={idPrefix + "-num_circled-select-field"} text="Number of circle-seeded heats" />}
                                field={<SearchSelect
                                    idPrefix={idPrefix + "-num_circled"}
                                    regex={/^(A(l(l( (f(u(l(l( (h(e(a(t(s?)?)?)?)?)?)?)?)?)?)?)?)?)?)?$|^([123456789][0-9]*)?$/}
                                    otherEnabled={true}
                                    placeholderText="Number of circle-seeded heats"
                                    defaultText="3"
                                    options={[
                                        "3", "All full heats"
                                    ]}
                                    pixelWidth={300}
                                />}
                                createInfo={{
                                    title: "NUMBER OF CIRCLE-SEEDED HEATS",
                                    description: "The number of circle-seeded heats field should contain the number of fully-filled fastest heats that should be circle-seeded. All other heats will be seeded using standard seeding rules.",
                                    permitted_values: "\"All full heats\" or any positive integer."
                                }}
                                optional={false}
                            />
                        }
                    </div>
                </div>
            </FormContext.Provider>

            <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text="Generate seeding" type="submit" handleClick={(event: any) => {
                event.preventDefault();
                handleSubmit();
            }} />
        </DataForm>
    )
}