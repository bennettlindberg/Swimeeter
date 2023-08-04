import { useId, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { convertRawData } from "../../utilities/forms/formHelpers.ts";
import { DestructiveType, DuplicateType, ErrorType } from "../../utilities/forms/formTypes.ts"

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";
import { SearchSelect } from "../../utilities/inputs/SearchSelect.tsx";

import { DataForm } from "../../utilities/forms/DataForm.tsx";
import { FormGroup } from "../../utilities/forms/FormGroup.tsx";
import { ErrorPane } from "../../utilities/forms/ErrorPane.tsx";
import { DuplicatePane } from "../../utilities/forms/DuplicatePane.tsx";
import { DestructivePane } from "../../utilities/forms/DestructivePane.tsx";

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
                destructive: action.destructive
            } as FormState;

        case "DISMISS_DESTRUCTIVE_PANE":
            return {
                ...state,
                destructive: null
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
        duplicate: null,
        destructive: null
    });
    const idPrefix = useId();
    const navigate = useNavigate();

    // * define form handlers
    function handleDuplicateSelection(duplicate_handling: "keep_new" | "keep_both" | "cancel") {
        if (duplicate_handling === "keep_new") {
            formDispatch({
                type: "TRIGGER_DESTRUCTIVE_PANE",
                destructive: {
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Replacing previously-created duplicate meets with this one will result in the deletion of the original meets. Are you sure you want to continue?",
                    impact: "Meets with the same name as this one will be deleted.",
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

    function handleDestructiveSelection(selection: "continue" | "cancel", duplicate_handling?: "unhandled" | "keep_new" | "keep_both") {
        if (selection === "continue") {
            handleSubmit(duplicate_handling);
        } else {
            formDispatch({
                type: "DISMISS_DESTRUCTIVE_PANE"
            });
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
        // ? name format is invalid
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
        const formattedVisibility = convertRawData<string, boolean>(
            rawData.visibility,
            [
                { raw: "Public", formatted: true },
                { raw: "Private", formatted: false },
            ]
        );
        if (formattedVisibility === undefined) {
            // ? incorrect input error
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "VISIBILITY FIELD ERROR",
                    description: "An unexpected value was entered for the visibility field.",
                    fields: "Visibility",
                    recommendation: "Choose \"Public\" or \"Private\" as the entered value for the visibility field."
                }
            });
            return;
        }

        const formattedData = {
            name: rawData.name,
            is_public: formattedVisibility
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
                            duplicate: {
                                title: "UNHANDLED DUPLICATE MEETS EXIST",
                                description: "One or more meets with the same name exist in your account. How would you like to resolve the duplicate data conflict?",
                                keep_both: true,
                                keep_new: true,
                            }
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
            {formState.duplicate && <DuplicatePane handleClick={handleDuplicateSelection} info={formState.duplicate} />}
            {formState.destructive && <DestructivePane handleClick={handleDestructiveSelection} info={formState.destructive} />}

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

            <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text="Create meet" type="submit" handleClick={(event: any) => {
                event.preventDefault();
                handleSubmit();
            }} />
        </DataForm>
    )
}