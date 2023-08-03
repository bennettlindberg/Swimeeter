import { useId, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { ErrorType } from "../../utilities/forms/formTypes.ts"

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";
import { SearchSelect } from "../../utilities/inputs/SearchSelect.tsx";

import { DataForm } from "../../utilities/forms/DataForm.tsx";
import { FormGroup } from "../../utilities/forms/FormGroup.tsx";
import { ErrorPane } from "../../utilities/forms/ErrorPane.tsx";
import { DuplicatePane } from "../../utilities/forms/DuplicatePane.tsx";

// * define form types
type FormState = {
    error: ErrorType | null,
    duplicate_displayed: boolean
}

type FormAction = {
    type: "SAVE_SUCCESS" | "DISMISS_ERROR" | "TRIGGER_DUPLICATE_PANE" | "DISMISS_DUPLICATE_PANE"
} | {
    type: "SAVE_FAILURE",
    error: ErrorType
}

// * define form reducer
function formReducer(state: FormState, action: FormAction) {
    switch (action.type) {
        case "SAVE_SUCCESS":
        case "DISMISS_ERROR":
            return {
                ...state,
                error: null,
            } as FormState;

        case "SAVE_FAILURE":
            return {
                ...state,
                error: action.error,
            } as FormState;

        case "TRIGGER_DUPLICATE_PANE":
            return {
                ...state,
                duplicate_displayed: true
            } as FormState;

        case "DISMISS_DUPLICATE_PANE":
            return {
                ...state,
                duplicate_displayed: false
            } as FormState;

        default:
            return state;
    }
}

// ~ component
export function MeetCreationForm() {
    // * initialize state, id, and navigation
    const [formState, formDispatch] = useReducer(formReducer, {
        error: null,
        duplicate_displayed: false,
    });
    const idPrefix = useId();
    const navigate = useNavigate();

    // * define form handlers
    function handleDuplicateSelection(duplicate_handling: "unhandled" | "keep_new" | "keep_both" | "cancel") {
        if (duplicate_handling !== "cancel") {
            handleSubmit(duplicate_handling);
        } else {
            formDispatch({
                type: "DISMISS_DUPLICATE_PANE"
            })
        }
    }

    async function handleSubmit(duplicate_handling?: "unhandled" | "keep_new" | "keep_both") {
        // * retrieve raw data
        let rawData: {
            name: string
            visibility: string,
        } = {
            name: "",
            visibility: "",
        }

        try {
            const nameField = document.getElementById(idPrefix + "-name-text-field") as HTMLInputElement;
            rawData.name = nameField.value;

            const visibilityField = document.getElementById(idPrefix + "-visibility-select-field") as HTMLInputElement;
            rawData.visibility = visibilityField.value;
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

        // * validate raw data
        const validName = rawData.name.length >= 1
        // ? email format is invalid
        if (!validName) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "NAME FIELD ERROR",
                    description: "The meet name field was left blank. Meet names are required and must be at least 1 character in length.",
                    fields: "Name",
                    recommendation: "Alter the entered name to conform to the requirements of the field."
                }
            });
            return;
        }

        // * interpret visibility string
        let is_public = true;
        switch (rawData.visibility) {
            case "Public":
                is_public = true;
                break;

            case "Private":
                is_public = false;
                break;

            default:
                formDispatch({
                    type: "SAVE_FAILURE",
                    error: {
                        title: "VISIBILITY FIELD ERROR",
                        description: "The entered visibility was a valid visibility selection. The visibility field can only be \"Public\" or \"Private\".",
                        fields: "Visibility",
                        recommendation: "Alter the entered visibility to conform to the requirements of the field."
                    }
                });
                return;
        }

        const formattedData = {
            name: rawData.name,
            is_public: is_public
        }

        // @ send new meet data to the back-end
        try {
            const response = await axios.post(
                '/api/v1/meets/',
                formattedData,
                { params: { duplicate_handling: duplicate_handling || "unhandled" } }
            );

            navigate(`/meets/${response.data.pk}`);
        } catch (error) {
            // ? back-end error
            if (axios.isAxiosError(error)) {
                switch (error.response?.data) {
                    case "user is not logged in":
                        formDispatch({
                            type: "SAVE_FAILURE",
                            error: {
                                title: "AUTHORIZATION ERROR",
                                description: "You are not currently logged into an account. Log into an account before creating a meet.",
                                recommendation: "Log into an account using the log in button found in the navigation bar."
                            }
                        });
                        return;

                    case "unhandled duplicates exist":
                        formDispatch({
                            type: "TRIGGER_DUPLICATE_PANE",
                        });
                        return;

                    default:
                        formDispatch({
                            type: "SAVE_FAILURE",
                            error: {
                                title: "UNKNOWN ERROR",
                                description: "An unknown error ocurred while attempting to submit the form."
                            }
                        });
                        return;
                }
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
            {formState.duplicate_displayed && <DuplicatePane handleClick={handleDuplicateSelection} info={{
                title: "UNHANDLED DUPLICATES EXIST",
                description: "One or more meets with the same name exist in your account. How would you like to resolve the duplicate data conflict?",
                keep_both: true,
                keep_new: true,
            }} />}

            <FormGroup
                label={<InputLabel inputId={idPrefix + "-name-text-field"} text="Name" />}
                field={<TextInput
                    regex={/^.*$/}
                    placeholderText="Name"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-name"}
                />}
                info={{
                    title: "NAME",
                    description: "The name field should contain the name of the meet being created. ",
                    permitted_values: "Any string at least 1 character long.",
                }}
            />

            <FormGroup
                label={<InputLabel inputId={idPrefix + "-visibility-select-field"} text="Visibility" />}
                field={<SearchSelect
                    regex={/^(P(u(b(l(i(c?)?)?)?)?)?)?$|^(P(r(i(v(a(t(e?)?)?)?)?)?)?)?$/}
                    otherEnabled={false}
                    pixelWidth={100}
                    idPrefix={idPrefix + "-visibility"}
                    options={["Public", "Private"]}
                />}
                info={{
                    title: "VISIBILITY",
                    description: "The value of the visibility field determines who can view the meet being created. Private meets can only be seen by the meet host.",
                    permitted_values: "Public, Private"
                }}
            />

            <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text="Log in" type="submit" handleClick={(event: any) => {
                event.preventDefault();
                handleSubmit();
            }} />
        </DataForm>
    )
}