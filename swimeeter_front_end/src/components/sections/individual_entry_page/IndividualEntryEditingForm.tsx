import { useContext, useId } from "react";

import { IndividualEntryContext } from "../../pages/individual_entries/IndividualEntryPage.tsx";
import { IndividualEntry } from "../../utilities/helpers/modelTypes.ts";

import { EditingForm } from "../../utilities/forms/EditingForm.tsx";
import { EditingFormGroup } from "../../utilities/forms/EditingFormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { DurationInput } from "../../utilities/inputs/DurationInput.tsx";
import { generateEventName, generateSeedTimeElements, generateSeedTimeString, generateSwimmerName } from "../../utilities/helpers/nameGenerators.ts";

// ~ component
export function IndividualEntryEditingForm() {
    // * initialize context, state, and id
    const { individualEntryData, setIndividualEntryData, isMeetHost }: {
        individualEntryData: IndividualEntry,
        setIndividualEntryData: React.Dispatch<React.SetStateAction<IndividualEntry>>,
        isMeetHost: boolean
    } = useContext(IndividualEntryContext);
    const idPrefix = useId();

    return (
        <>
            <EditingForm
                modelData={individualEntryData}
                setModelData={setIndividualEntryData}
                isMeetHost={isMeetHost}
                formInputFields={[
                    {
                        title: "seed_time",
                        idSuffix: "-seed_time-duration-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-seed_time-duration-field"} text="Seed time" />}
                            key={idPrefix + "-seed_time-duration-field"}
                            optional={false}
                            field={<DurationInput
                                idPrefix={idPrefix + "-seed_time"}
                                defaults={generateSeedTimeElements(individualEntryData.fields.seed_time)}
                                rawDurationNumber={individualEntryData.fields.seed_time}
                                rawDurationString={generateSeedTimeString(individualEntryData.fields.seed_time)}
                            />}
                            editInfo={{
                                title: "SEED TIME",
                                description: "The seed time field should contain the seed time of the individual entry. Usually, this is the fastest time previously swam by the chosen swimmer in the chosen event.",
                                permitted_values: "Any valid non-zero duration. Any subsection may be left blank if zero of the specified time increments are required to represent the duration."
                            }}
                            viewInfo={{
                                title: "SEED TIME",
                                description: "The seed time field contains the seed time of the individual entry. Usually, this is the fastest time previously swam by the swimmer in the event.",
                            }}
                        />,
                        validator: (duration: string) => {
                            try {
                                const duration_INT = parseInt(duration);
                                if (duration_INT === 0) {
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
                    }
                ]}
                modelSelectFields={individualEntryData.pk !== -1
                    ? [
                        {
                            queryParamTitle: "event_id",
                            idSuffix: "-event-model-select-field",
                            baseInfo: {
                                title: "EVENT",
                                description: "The event field should contain the name of the event the entry is associated with.",
                                permitted_values: "Any string. Only individual events can be chosen."
                            },
                            viewInfo: {
                                title: "EVENT",
                                description: "The event field contains the name of the event the entry is associated with.",
                            },
                            label: <InputLabel inputId={idPrefix + "-event-model-select-field"} text="Event" />,
                            optional: false,
                            placeholderText: "Event",
                            defaultSelection: {
                                text: generateEventName(individualEntryData.fields.event),
                                model_id: individualEntryData.fields.event.pk
                            },
                            modelInfo: {
                                modelName: "EVENT",
                                specific_to: "meet",
                                apiRoute: "/api/v1/events/",
                                id_params: {
                                    meet_id: individualEntryData.fields.swimmer.fields.meet.pk,
                                    event_type: "individual"
                                }
                            }
                        },
                        {
                            queryParamTitle: "swimmer_id",
                            idSuffix: "-swimmer-model-select-field",
                            baseInfo: {
                                title: "SWIMMER",
                                description: "The swimmer field should contain the name of the swimmer the entry is associated with.",
                                permitted_values: "Any string."
                            },
                            viewInfo: {
                                title: "SWIMMER",
                                description: "The swimmer field contains the name of the swimmer the entry is associated with.",
                            },
                            label: <InputLabel inputId={idPrefix + "-swimmer-model-select-field"} text="Swimmer" />,
                            optional: false,
                            placeholderText: "Swimmer",
                            defaultSelection: {
                                text: generateSwimmerName(individualEntryData.fields.swimmer),
                                model_id: individualEntryData.fields.swimmer.pk
                            },
                            modelInfo: {
                                modelName: "SWIMMER",
                                specific_to: "meet",
                                apiRoute: "/api/v1/swimmers/",
                                id_params: {
                                    meet_id: individualEntryData.fields.swimmer.fields.meet.pk,
                                }
                            }
                        }
                    ]
                    : []}
                destructiveKeepNewInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Replacing previously-created duplicate entries with this one will result in the deletion of the original entries. Are you sure you want to continue?",
                    impact: "If an individual entry for the same swimmer in the same event as this one exists, it will be replaced with this new entry.",
                    type: "duplicate_keep_new"
                }}
                destructiveSubmitInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Modifying an individual entry will trigger the invalidation and deletion of the associated event's seeding. Are you sure you want to continue?",
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
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into an account before modifying this individual entry.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the host account for this meet. Log into the host account before modifying this individual entry.",
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
                queryParams={{
                    "individual_entry_id": individualEntryData.pk
                }}
                submitText="Save individual entry"
                editText="Edit individual entry"
                destructiveDeletionInfo={{
                    title: "DESTRUCTIVE DELETION",
                    description: "Deleting this individual entry will permanently delete the entry and trigger the invalidation and deletion of the associated event's seeding. Are you sure you want to continue?",
                    impact: "All individual entry data and the associated event's heat sheet seeding will be permanently deleted.",
                    type: "destructive_deletion"
                }}
                deletionErrorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the account of the meet host. Log into the host account before deleting this individual entry.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the account of the meet host. Log into the host account before deleting this individual entry.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    }
                ]}
                deletionText="Delete individual entry"
                deletionQueryParam={{
                    "individual_entry_id": individualEntryData.pk
                }}
                deletionForwardRoute={`/meets/${individualEntryData.fields.swimmer.fields.meet.pk}`}
            />
        </>
    )
}