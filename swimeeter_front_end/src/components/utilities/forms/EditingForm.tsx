import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { DestructiveType, DuplicateType, ErrorType, InfoType } from "../helpers/formTypes.ts";
import { FormContext } from "../helpers/formHelpers.ts";

import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { DataForm } from "../../utilities/forms/DataForm.tsx";
import { ErrorPane } from "../../utilities/forms/ErrorPane.tsx";
import { DuplicatePane } from "../../utilities/forms/DuplicatePane.tsx";
import { DestructivePane } from "../../utilities/forms/DestructivePane.tsx";
import { ModelSelectGenerator } from "./ModelSelectGenerator.tsx";

// * define form types
type FormState = {
    mode: "view" | "edit"
    error: ErrorType | null,
    duplicate: DuplicateType | null,
    destructive: DestructiveType | null
}

type FormAction = {
    type: "EDIT_CLICKED" | "SAVE_SUCCESS" | "CANCEL_CLICKED" | "DISMISS_ERROR" | "DISMISS_DUPLICATE_PANE" | "DISMISS_DESTRUCTIVE_PANE"
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
        case "EDIT_CLICKED":
            return {
                error: null,
                duplicate: null,
                destructive: null,
                mode: "edit"
            } as FormState;

        case "SAVE_SUCCESS":
        case "CANCEL_CLICKED":
            return {
                error: null,
                duplicate: null,
                destructive: null,
                mode: "view"
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
export function EditingForm({
    modelData,
    setModelData,
    isMeetHost,
    formInputFields,
    modelSelectFields,
    destructiveKeepNewInfo,
    destructiveSubmitInfo,
    duplicateInfo,
    rawDataInit,
    apiRoute,
    errorPossibilities,
    idPrefix,
    queryParams,
    submitText,
    editText,
    destructiveDeletionInfo,
    deletionErrorPossibilities,
    deletionText,
    deletionQueryParam,
    deletionForwardRoute
}: {
    modelData: any,
    setModelData: React.Dispatch<React.SetStateAction<any>>,
    isMeetHost: boolean,
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
        idSuffix?: string,
        baseInfo: InfoType,
        viewInfo?: InfoType
        label: JSX.Element,
        optional: boolean,
        placeholderText: string,
        defaultSelection: {
            text: string,
            model_id: number
        }
        modelInfo: {
            modelName: string,
            specific_to: string,
            apiRoute: string,
            id_params: Object
        }
    }[],
    destructiveKeepNewInfo: DestructiveType,
    destructiveSubmitInfo?: DestructiveType,
    duplicateInfo: DuplicateType,
    rawDataInit: { [key: string]: any },
    apiRoute: string,
    errorPossibilities: {
        matchString: string,
        error: ErrorType
    }[],
    idPrefix: string,
    queryParams: any,
    submitText: string
    editText: string,
    destructiveDeletionInfo: DestructiveType,
    deletionErrorPossibilities: {
        matchString: string,
        error: ErrorType
    }[],
    deletionText: string,
    deletionQueryParam: {
        [key: string]: any
    },
    deletionForwardRoute: string
}) {
    // * initialize state and navigation
    const [formState, formDispatch] = useReducer(formReducer, {
        mode: "view",
        error: null,
        duplicate: null,
        destructive: null,
    });
    const [modelIdSelections, setModelIdSelections] = useState<{[key: string]: number}>({});
    const navigate = useNavigate();

    // * disable applicable inputs if view only
    useEffect(() => {
        for (const formInput of formInputFields) {
            const inputElement = document.getElementById(idPrefix + formInput.idSuffix) as HTMLInputElement;

            if (formInput.readOnly) {
                inputElement.readOnly = true;
            } else {
                inputElement.readOnly = formState.mode === "view";
            }
        }

        for (const modelSelectInput of modelSelectFields) {
            const inputElement = document.getElementById(idPrefix + modelSelectInput.idSuffix) as HTMLInputElement;

            inputElement.readOnly = formState.mode === "view";
        }
    }, [formState.mode, modelData]);

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

                case "destructive_deletion":
                    handleDelete(true);
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

        // * duplicate-sensitive data did not change -> skip duplicate conflict
        let ignoreDuplicates = true;
        for (const formInput of formInputFields) {
            if (formInput.duplicateSensitive && formData[formInput.title] !== modelData["fields"][formInput.title]) {
                ignoreDuplicates = false;
            }
        }
        if (ignoreDuplicates) {
            duplicate_handling = "keep_both";
        }

        // @ send new model data to the back-end
        try {
            const response = await axios.put(
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

            setModelData(response.data);

            formDispatch({
                type: "SAVE_SUCCESS"
            });
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

    async function handleDelete(bypassDestructiveDeletion?: boolean) {
        // ~ submit counts as destructive action -> show destructive pop-up
        if (!bypassDestructiveDeletion) {
            formDispatch({
                type: "TRIGGER_DESTRUCTIVE_PANE",
                destructive: destructiveDeletionInfo
            });
            return;
        }

        // @ send new model data to the back-end
        try {
            const response = await axios.delete(
                apiRoute,
                {
                    params: {
                        ...deletionQueryParam,
                    }
                }
            );

            navigate(deletionForwardRoute);
        } catch (error) {
            // ? back-end error
            if (axios.isAxiosError(error)) {
                const errorTitle = error.response?.data;

                // ~ iterate over passed error possibilities
                for (const errorPossibility of deletionErrorPossibilities) {
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

    function handleCancel() {
        formDispatch({
            type: "CANCEL_CLICKED"
        })
    }

    function handleEdit() {
        formDispatch({
            type: "EDIT_CLICKED"
        })
    }

    return (
        <DataForm>
            {formState.error && <ErrorPane error={formState.error} handleXClick={() => formDispatch({ type: "DISMISS_ERROR" })} />}
            {formState.duplicate && <DuplicatePane handleClick={handleDuplicateSelection} info={formState.duplicate} />}
            {formState.destructive && <DestructivePane handleClick={handleDestructiveSelection} info={formState.destructive} />}

            <FormContext.Provider value={formState.mode === "edit"}>
                {formInputFields.map(formInput => formInput.formGroup)}
                {modelSelectFields.map(modelSelectInput => {
                    return (
                        <ModelSelectGenerator 
                            formGroupType="editing"
                            optional={modelSelectInput.optional}
                            idPrefix={idPrefix}
                            modelInfo={modelSelectInput.modelInfo}
                            label={modelSelectInput.label}
                            baseInfo={modelSelectInput.baseInfo}
                            viewInfo={modelSelectInput.viewInfo}
                            placeholderText={modelSelectInput.placeholderText}
                            defaultSelection={modelSelectInput.defaultSelection}
                            setModelSelection={(selection: {
                                text: string,
                                model_id: number
                            }) => handleModelSelection(modelSelectInput.queryParamTitle, selection)}
                        />
                    )
                })}
            </FormContext.Provider>

            {formState.mode === "edit"
                ? <div className="flex flex-col gap-y-2">
                    <div className="flex flex-row flex-wrap gap-x-2">
                        <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text={submitText} type="submit" handleClick={(event: any) => {
                            event.preventDefault();
                            handleSubmit();
                        }} />
                        <InputButton idPrefix={idPrefix + "-cancel"} color="red" icon="CIRCLE_CROSS" text="Cancel" type="button" handleClick={handleCancel} />
                    </div>
                    <InputButton idPrefix={idPrefix + "-cancel"} color="red" icon="TRASH_CAN" text={deletionText} type="button" handleClick={() => handleDelete(false)} />
                </div>
                : isMeetHost && <InputButton idPrefix={idPrefix + "-edit"} color="purple" icon="CIRCLE_BOLT" text={editText} type="button" handleClick={handleEdit} />
            }
        </DataForm>
    )
}