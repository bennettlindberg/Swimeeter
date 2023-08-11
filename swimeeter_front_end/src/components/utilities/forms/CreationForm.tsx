import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { DestructiveType, DuplicateType, ErrorType, InfoType } from "../../utilities/forms/formTypes.ts";

import { InputButton } from "../../utilities/inputs/InputButton.tsx";

import { DataForm } from "../../utilities/forms/DataForm.tsx";
import { ErrorPane } from "../../utilities/forms/ErrorPane.tsx";
import { DuplicatePane } from "../../utilities/forms/DuplicatePane.tsx";
import { DestructivePane } from "../../utilities/forms/DestructivePane.tsx";
import { ModelSelectGenerator } from "./ModelSelectGenerator.tsx";

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

// ~ component
export function CreationForm({
    formInputFields,
    modelSelectFields,
    destructiveKeepNewInfo,
    destructiveSubmitInfo,
    duplicateInfo,
    rawDataInit,
    apiRoute,
    modelPageRoute,
    errorPossibilities,
    idPrefix,
    queryParams,
    submitText
}: {
    formInputFields: {
        title: string
        idSuffix: string,
        readOnly: boolean,
        duplicateSensitive: boolean,
        formGroup: React.ReactNode,
        validator?: (value: any) => true | ErrorType
        converter?: (value: any) => any
    }[],
    modelSelectFields: {
        queryParamTitle: string,
        idSuffix: string,
        type: string,
        info: InfoType,
        label: JSX.Element,
        placeholderText: string,
        defaultInfo: {
            text: string,
            model_id: number
        }
        modelInfo: {
            modelName: string,
            specific_to: number,
            apiRoute: string,
            id_params: {
                meet_id: number
            }
        }
    }[],
    destructiveKeepNewInfo: DestructiveType,
    destructiveSubmitInfo?: DestructiveType,
    duplicateInfo: DuplicateType,
    rawDataInit: { [key: string]: any },
    apiRoute: string,
    modelPageRoute: string,
    errorPossibilities: {
        matchString: string,
        error: ErrorType
    }[],
    idPrefix: string,
    queryParams: any,
    submitText: string
}) {
    // * initialize state and navigation
    const [formState, formDispatch] = useReducer(formReducer, {
        error: null,
        duplicate: null,
        destructive: null,
    });
    const [modelIdSelections, setModelIdSelections] = useState<{[key: string]: number}>({});
    const navigate = useNavigate();

    // * disable read-only inputs
    useEffect(() => {
        for (const formInput of formInputFields) {
            const inputElement = document.getElementById(idPrefix + formInput.idSuffix) as HTMLInputElement;

            if (formInput.readOnly) {
                inputElement.readOnly = true;
            }
        }
    }, []);

    // * define form handlers
    function handleModelSelection(queryParamString: string, selection: {
        text: string,
        model_id: number
    }) {
        if (selection.model_id === -1) {
            return;
        }

        setModelIdSelections({
            ...modelIdSelections,
            [queryParamString]: selection.model_id
        })
    }

    function handleDuplicateSelection(duplicate_handling: "keep_new" | "keep_both" | "cancel") {
        if (duplicate_handling === "keep_new") {
            formDispatch({
                type: "TRIGGER_DESTRUCTIVE_PANE",
                destructive: destructiveKeepNewInfo
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
        // ~ submit counts as destructive action -> show destructive pop-up
        if (destructiveSubmitInfo && !bypassDestructiveSubmission) {
            formDispatch({
                type: "TRIGGER_DESTRUCTIVE_PANE",
                destructive: destructiveSubmitInfo
            });
            return;
        }

        // * retrieve raw data
        let formData = rawDataInit;

        try {
            for (const formInput of formInputFields) {
                if (formInput.readOnly) {
                    continue;
                }

                // * retrieve input
                const inputField = document.getElementById(idPrefix + formInput.idSuffix) as HTMLInputElement;
                formData[formInput.title] = inputField.value;

                // * validate input
                if (formInput.validator) {
                    const isValid = formInput.validator(formData[formInput.title]);

                    // ? input validation error
                    if (isValid !== true) {
                        formDispatch({
                            type: "SAVE_FAILURE",
                            error: isValid
                        });
                        return;
                    }
                }

                // * convert input to proper form
                if (formInput.converter) {
                    formData[formInput.title] = formInput.converter(formData[formInput.title]);
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
            const response = await axios.post(
                apiRoute,
                formData,
                {
                    params: {
                        duplicate_handling: duplicate_handling || "unhandled",
                        ...queryParams,
                        ...modelIdSelections
                    }
                }
            );

            formDispatch({
                type: "SAVE_SUCCESS"
            });

            navigate(`/${modelPageRoute}/${response.data.pk}`);
        } catch (error) {
            // ? back-end error
            if (axios.isAxiosError(error)) {
                const errorTitle = error.response?.data;

                // ~ duplicates exist that need to be handled
                if (errorTitle === "unhandled duplicates exist") {

                    formDispatch({
                        type: "TRIGGER_DUPLICATE_PANE",
                        duplicate: duplicateInfo
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

            {formInputFields.map(formInput => formInput.formGroup)}
            {modelSelectFields.map(modelSelectInput => {
                return (
                    <ModelSelectGenerator 
                        idPrefix={idPrefix}
                        modelInfo={modelSelectInput.modelInfo}
                        label={modelSelectInput.label}
                        info={modelSelectInput.info}
                        placeholderText={modelSelectInput.placeholderText}
                        defaultInfo={modelSelectInput.defaultInfo}
                        setModelSelection={(selection: {
                            text: string,
                            model_id: number
                        }) => handleModelSelection(modelSelectInput.queryParamTitle, selection)}
                    />
                )
            })}

            <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text={submitText} type="submit" handleClick={(event: any) => {
                event.preventDefault();
                handleSubmit();
            }} />
        </DataForm>
    )
}