import { useId } from "react";
import { useLocation } from "react-router-dom";

import { CreationForm } from "../../utilities/forms/CreationForm.tsx";
import { CreationFormGroup } from "../../utilities/forms/CreationFormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";
import { DateTimeInput } from "../../utilities/inputs/DateTimeInput.tsx";

// ~ component
export function SessionCreationForm({ meet_id_INT }: { meet_id_INT: number }) {
    // * initialize id
    const idPrefix = useId();

    // * initialize location
    const location = useLocation();
    let defaultPool: {name: string, pool_id: number} | undefined = undefined;
    try {
        defaultPool = location.state.defaultPool;
    } catch {
        defaultPool = undefined;
    }

    return (
        <>
            <CreationForm
                formInputFields={[
                    {
                        title: "name",
                        idSuffix: "-name-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-name-text-field"} text="Name" />}
                            key={idPrefix + "-name-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Name"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-name"}
                            />}
                            createInfo={{
                                title: "NAME",
                                description: "The name field should contain the given name of the session being created.",
                                permitted_values: "Any string at least 1 character long."
                            }}
                        />,
                        validator: (name: string) => {
                            if (name.length > 0) {
                                return true;
                            } else {
                                return {
                                    title: "NAME FIELD ERROR",
                                    description: "The session name field was left blank. Session names are required and must be at least 1 character in length.",
                                    fields: "Name",
                                    recommendation: "Alter the entered name to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                    {
                        title: "begin_time",
                        idSuffix: "-begin_time-datetime-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-begin_time-datetime-field"} text="Begin time" />}
                            key={idPrefix + "-begin_time-datetime-field"}
                            optional={false}
                            field={<DateTimeInput
                                idPrefix={idPrefix + "-begin_time"}
                            />}
                            createInfo={{
                                title: "BEGIN TIME",
                                description: "The begin time field should contain the beginning time of the session being created in your local timezone.",
                                permitted_values: "Any valid date and time combination in your local timezone."
                            }}
                        />,
                        validator: (inputDateTime: string) => {
                            try {
                                const testDate = new Date(inputDateTime);
                    
                                if (isNaN(testDate.getTime()) || parseInt(inputDateTime.substring(8, 10)) !== testDate.getDate()) {
                                    return {
                                        title: "BEGIN TIME FIELD ERROR",
                                        description: "An invalid value was provided to the begin time field. Session begin times must be valid date and time combinations in your local timezone.",
                                        fields: "Begin time",
                                        recommendation: "Alter the entered begin time to conform to the requirements of the field."
                                    }
                                } else {
                                    return true;
                                }
                            } catch {
                                return {
                                    title: "BEGIN TIME FIELD ERROR",
                                    description: "An invalid value was provided to the begin time field. Session begin times must be valid date and time combinations in your local timezone.",
                                    fields: "Begin time",
                                    recommendation: "Alter the entered begin time to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                    {
                        title: "end_time",
                        idSuffix: "-end_time-datetime-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-end_time-datetime-field"} text="End time" />}
                            key={idPrefix + "-end_time-datetime-field"}
                            optional={false}
                            field={<DateTimeInput
                                idPrefix={idPrefix + "-end_time"}
                            />}
                            createInfo={{
                                title: "END TIME",
                                description: "The end time field should contain the ending time of the session being created in your local timezone.",
                                permitted_values: "Any valid date and time combination in your local timezone."
                            }}
                        />,
                        validator: (inputDateTime: string) => {
                            try {
                                const testDate = new Date(inputDateTime);
                    
                                if (isNaN(testDate.getTime()) || parseInt(inputDateTime.substring(8, 10)) !== testDate.getDate()) {
                                    return {
                                        title: "END TIME FIELD ERROR",
                                        description: "An invalid value was provided to the end time field. Session end times must be valid date and time combinations in your local timezone.",
                                        fields: "End time",
                                        recommendation: "Alter the entered end time to conform to the requirements of the field."
                                    }
                                } else {
                                    return true;
                                }
                            } catch {
                                return {
                                    title: "END TIME FIELD ERROR",
                                    description: "An invalid value was provided to the end time field. Session end times must be valid date and time combinations in your local timezone.",
                                    fields: "end time",
                                    recommendation: "Alter the entered end time to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                ]}
                modelSelectFields={[
                    {
                        queryParamTitle: "pool_id",
                        baseInfo: {
                            title: "POOL",
                            description: "The pool field should contain the name of the pool at which the session being created will be located.",
                            permitted_values: "Any string."
                        },
                        label: <InputLabel inputId={idPrefix + "-pool-model-select-field"} text="Pool" />,
                        optional: false,
                        placeholderText: "Pool",
                        defaultSelection: {
                            text: defaultPool ? defaultPool.name : "",
                            model_id: defaultPool ? defaultPool.pool_id : -1
                        },
                        modelInfo: {
                            modelName: "POOL",
                            specific_to: "meet",
                            apiRoute: "/api/v1/pools/",
                            id_params: {
                                meet_id: meet_id_INT
                            }
                        }
                    }
                ]}
                destructiveKeepNewInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Replacing previously-created duplicate sessions with this one will result in the deletion of the original sessions. Are you sure you want to continue?",
                    impact: "Sessions with the same name and competition pool as this one will be deleted.",
                    type: "duplicate_keep_new"
                }}
                // destructiveSubmitInfo={{
                //     title: "POTENTIALLY DESTRUCTIVE ACTION",
                //     description: "TEST",
                //     impact: "TEST.",
                //     type: "destructive_submission"
                // }}
                duplicateInfo={{
                    title: "UNHANDLED DUPLICATE SESSIONS EXIST",
                    description: "One or more sessions with the same name and competition pool exist in your account. How would you like to resolve the duplicate data conflict?",
                    keep_both: true,
                    keep_new: true,
                }}
                rawDataInit={{
                    name: "",
                    begin_time: new Date(),
                    end_time: new Date()
                }}
                apiRoute="/api/v1/sessions/"
                modelPageRoute={`meets/${meet_id_INT}/sessions`}
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into an account before creating a session for this meet.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the host account for this meet. Log into the host account before creating a session for this meet.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "no pool_id query parameter passed",
                        error: {
                            title: "POOL FIELD ERROR",
                            description: "No pool matching the pool name provided in the pool field exists. Every session must be associated with a pool.",
                            recommendation: "Choose an existing pool for the session to be associated with. If no pools exist, first add a pool to the meet."
                        }
                    },
                    {
                        matchString: "no Pool with the given id exists",
                        error: {
                            title: "POOL FIELD ERROR",
                            description: "No pool matching the pool name provided in the pool field exists. Every session must be associated with a pool.",
                            recommendation: "Choose an existing pool for the session to be associated with. If no pools exist, first add a pool to the meet."
                        }
                    },
                    {
                        matchString: "end time before begin time",
                        error: {
                            title: "BEGINNING AND ENDING TIMES ERROR",
                            description: "The entered ending time occurs before or at the same time as the entered beginning time. Session ending times must occur after beginning times.",
                            fields: "Begin time, End time",
                            recommendation: "Choose valid beginning and ending times where the beginning time occurs before the ending time."
                        }
                    }
                ]}
                idPrefix={idPrefix}
                queryParams={{
                    meet_id: meet_id_INT
                }}
                submitText="Create session"
            />
        </>
    )
}