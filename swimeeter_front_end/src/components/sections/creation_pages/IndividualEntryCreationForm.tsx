import { useId } from "react";
import { useLocation } from "react-router-dom";

import { CreationForm } from "../../utilities/forms/CreationForm.tsx";
import { CreationFormGroup } from "../../utilities/forms/CreationFormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { DurationInput } from "../../utilities/inputs/DurationInput.tsx";
import { NeutralFormGroup } from "../../utilities/forms/NeutralFormGroup.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";

// ~ component
export function IndividualEntryCreationForm({ meet_id_INT }: { meet_id_INT: number }) {
    // * initialize id
    const idPrefix = useId();

    // * initialize location
    const location = useLocation();
    let defaultSwimmer: {name: string, swimmer_id: number} | undefined = undefined;
    try {
        defaultSwimmer = location.state.defaultSwimmer;
    } catch {
        defaultSwimmer = undefined;
    }
    let defaultEvent: {name: string, event_id: number} | undefined = undefined;
    try {
        defaultEvent = location.state.defaultEvent;
    } catch {
        defaultEvent = undefined;
    }

    return (
        <>
            <CreationForm
                formInputFields={[
                    {
                        title: "seed_time",
                        idSuffix: "-seed_time-duration-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-seed_time-duration-field"} text="Seed time" />}
                            key={idPrefix + "-seed_time-duration-field"}
                            optional={false}
                            field={<DurationInput 
                                idPrefix={idPrefix + "-seed_time"}
                            />}
                            createInfo={{
                                title: "SEED TIME",
                                description: "The seed time field should contain the seed time of the individual entry being created. Usually, this is the fastest time previously swam by the chosen swimmer in the chosen event.",
                                permitted_values: "Any valid non-zero duration. Any subsection may be left blank if zero of the specified time increments are required to represent the duration."
                            }}
                        />,
                        validator: (duration: string) => {
                            try {
                                const duration_INT = parseInt(duration);
                                if (duration_INT <= 0) {
                                    return {
                                        title: "SEED TIME FIELD ERROR",
                                        description: "The individual entry seed time field was given a zero time duration. Individual entry seed times must be valid non-zero durations in the form HH:mm:ss:SS.",
                                        fields: "Seed time",
                                        recommendation: "Alter the entered seed time to conform to the requirements of the field."
                                    }
                                } else {
                                    return true;
                                }
                            } catch {
                                return {
                                    title: "SEED TIME FIELD ERROR",
                                    description: "The individual entry seed time field was given an invalid value. Individual entry must be valid non-zero durations in the form HH:mm:ss:SS.",
                                    fields: "Seed time",
                                    recommendation: "Alter the entered seed time to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                    {
                        title: "heat_number",
                        idSuffix: "-heat_number-text-field",
                        readOnly: true,
                        duplicateSensitive: false,
                        formGroup: <NeutralFormGroup
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
                        />,
                    },
                    {
                        title: "lane_number",
                        idSuffix: "-lane_number-text-field",
                        readOnly: true,
                        duplicateSensitive: false,
                        formGroup: <NeutralFormGroup
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
                        />,
                    }
                ]}
                modelSelectFields={[
                    {
                        queryParamTitle: "event_id",
                        baseInfo: {
                            title: "EVENT",
                            description: "The event field should contain the name of the event the entry being created is associated with.",
                            permitted_values: "Any string. Only individual events can be chosen."
                        },
                        label: <InputLabel inputId={idPrefix + "-event-model-select-field"} text="Event" />,
                        optional: false,
                        placeholderText: "Event",
                        defaultSelection: {
                            text: defaultEvent ? defaultEvent.name : "",
                            model_id: defaultEvent ? defaultEvent.event_id : -1
                        },
                        modelInfo: {
                            modelName: "EVENT",
                            specific_to: "meet",
                            apiRoute: "/api/v1/events/",
                            id_params: {
                                meet_id: meet_id_INT,
                                event_type: "individual"
                            }
                        }
                    },
                    {
                        queryParamTitle: "swimmer_id",
                        baseInfo: {
                            title: "SWIMMER",
                            description: "The swimmer field should contain the name of the swimmer the entry being created is associated with.",
                            permitted_values: "Any string."
                        },
                        label: <InputLabel inputId={idPrefix + "-swimmer-model-select-field"} text="Swimmer" />,
                        optional: false,
                        placeholderText: "Swimmer",
                        defaultSelection: {
                            text: defaultSwimmer ? defaultSwimmer.name : "",
                            model_id: defaultSwimmer ? defaultSwimmer.swimmer_id : -1
                        },
                        modelInfo: {
                            modelName: "SWIMMER",
                            specific_to: "meet",
                            apiRoute: "/api/v1/swimmers/",
                            id_params: {
                                meet_id: meet_id_INT,
                            }
                        }
                    }
                ]}
                destructiveKeepNewInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Replacing previously-created duplicate entries with this one will result in the deletion of the original entries. Are you sure you want to continue?",
                    impact: "If an individual entry for the same swimmer in the same event as this one exists, it will be replaced with this new entry.",
                    type: "duplicate_keep_new"
                }}
                destructiveSubmitInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Creating a new individual entry will trigger the invalidation and deletion of the associated event's seeding. Are you sure you want to continue?",
                    impact: "The associated event's heat sheet seeding will be permanently deleted.",
                    type: "destructive_submission"
                }}
                duplicateInfo={{
                    title: "UNHANDLED DUPLICATE ENTRIES EXIST",
                    description: "An individual entry for the same swimmer in the same event exists in your account. How would you like to resolve the duplicate data conflict?",
                    keep_both: false,
                    keep_new: true,
                }}
                rawDataInit={{
                    seed_time: -1,
                }}
                apiRoute="/api/v1/individual_entries/"
                modelPageRoute={`meets/${meet_id_INT}/individual_entries`}
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into an account before creating an individual entry for this meet.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the host account for this meet. Log into the host account before creating an individual entry for this meet.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "no event_id query parameter passed",
                        error: {
                            title: "EVENT FIELD ERROR",
                            description: "No event matching the event name provided in the event field exists. Every individual entry must be associated with a event.",
                            recommendation: "Choose an existing event for the individual entry to be associated with. If no events exist, first add an event to the meet."
                        }
                    },
                    {
                        matchString: "no Event with the given id exists",
                        error: {
                            title: "EVENT FIELD ERROR",
                            description: "No event matching the event name provided in the event field exists. Every individual entry must be associated with a event.",
                            recommendation: "Choose an existing event for the individual entry to be associated with. If no events exist, first add an event to the meet."
                        }
                    },
                    {
                        matchString: "no swimmer_id query parameter passed",
                        error: {
                            title: "SWIMMER FIELD ERROR",
                            description: "No swimmer matching the swimmer name provided in the swimmer field exists. Every individual entry must be associated with a swimmer.",
                            recommendation: "Choose an existing swimmer for the individual entry to be associated with. If no swimmers exist, first add a swimmer to the meet."
                        }
                    },
                    {
                        matchString: "no Swimmer with the given id exists",
                        error: {
                            title: "SWIMMER FIELD ERROR",
                            description: "No swimmer matching the swimmer name provided in the swimmer field exists. Every individual entry must be associated with a swimmer.",
                            recommendation: "Choose an existing swimmer for the individual entry to be associated with. If no swimmers exist, first add a swimmer to the meet."
                        }
                    },
                    {
                        matchString: "swimmer and event are incompatible",
                        error: {
                            title: "SWIMMER AND EVENT COMPATIBILITY ERROR",
                            description: "The chosen swimmer and event for this individual entry are incompatible. The entry's swimmer must meet the event's competitor demographic requirements.",
                            recommendation: "Choose a swimmer and event pairing for the individual entry such that the swimmer's age and gender are compatible with the event's competing age range and gender."
                        }
                    }
                ]}
                idPrefix={idPrefix}
                queryParams={{}}
                submitText="Create individual entry"
            />
        </>
    )
}