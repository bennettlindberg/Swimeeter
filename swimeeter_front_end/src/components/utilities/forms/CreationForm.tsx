import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { DestructiveType, DuplicateType, ErrorType, InfoType } from "../helpers/formTypes.ts";

import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { FormContext } from "../helpers/formHelpers.ts";

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
    scrollRef,
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
    scrollRef?: React.RefObject<HTMLHeadingElement>,
    formInputFields: {
        title: string
        idSuffix: string,
        readOnly: boolean,
        duplicateSensitive: boolean,
        formGroup: React.ReactNode,
        validator?: (value: any) => true | ErrorType
        converter?: (value: any) => any
    }[][],
    modelSelectFields: {
        queryParamTitle: string,
        idSuffix?: string,
        baseInfo: InfoType,
        viewInfo?: InfoType,
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
    }[][],
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
    const [modelIdSelections, setModelIdSelections] = useState<{ [key: string]: number }>({});
    const navigate = useNavigate();

    // * disable read-only inputs
    useEffect(() => {
        for (const formInputRow of formInputFields) {
            for (const formInput of formInputRow) {
                const inputElement = document.getElementById(idPrefix + formInput.idSuffix) as HTMLInputElement;

                if (formInput.readOnly) {
                    inputElement.readOnly = true;
                }

                // ! disable "view" version of datetime and duration fields
                if (new RegExp("datetime").test(formInput.idSuffix) || new RegExp("duration").test(formInput.idSuffix)) {
                    const viewElement = document.getElementById(idPrefix + formInput.idSuffix + "-view") as HTMLInputElement;
                    viewElement.readOnly = true;
                }
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
                    handleSubmit(duplicate_handling, true);
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
        if (scrollRef) {
            scrollRef.current?.scrollIntoView();
        }

        // ~ submit counts as destructive action -> show destructive pop-up
        if (destructiveSubmitInfo && !bypassDestructiveSubmission) {
            formDispatch({
                type: "TRIGGER_DESTRUCTIVE_PANE",
                destructive: destructiveSubmitInfo
            });
            return;
        }

        // * ensure all model selections are made
        for (const modelSelectRow of modelSelectFields) {
            for (const modelSelectInput of modelSelectRow) {
                if (modelIdSelections[modelSelectInput.queryParamTitle] === -1
                    || modelIdSelections[modelSelectInput.queryParamTitle] === undefined) {
                    // ? invalid model selection
                    const fieldName = modelSelectInput.modelInfo.modelName;
                    formDispatch({
                        type: "SAVE_FAILURE",
                        error: {
                            title: `${fieldName} FIELD ERROR`,
                            description: `The ${fieldName.toLowerCase()} field was provided an invalid value. The ${fieldName.toLowerCase()} field must be provided the name of a valid ${fieldName.toLowerCase()} in this meet.`,
                            fields: fieldName.length > 1 ? `${fieldName.substring(0, 1)}${fieldName.substring(1).toLowerCase()}` : fieldName.length === 1 ? fieldName : "Unknown",
                            recommendation: `Alter the ${fieldName.toLowerCase()} to conform to the requirements of the ${fieldName.toLowerCase()} field.`
                        }
                    });
                }
            }
        }

        // * retrieve raw data
        let formData = rawDataInit;

        try {
            for (const formInputRow of formInputFields) {
                for (const formInput of formInputRow) {
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

            <FormContext.Provider value={true}>
                {formInputFields.map(formInputRow => {
                    return <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 items-end p-2 rounded-md border-2 odd:bg-slate-50 even:bg-transparent odd:dark:bg-slate-900 even:dark:bg-transparent border-slate-200 dark:border-slate-700">
                        {formInputRow.map(formInput => {
                            return <div className="max-w-min min-w-[300px]">
                                {formInput.formGroup}
                            </div>
                        })}
                    </div>
                })}
                {modelSelectFields.map(modelSelectRow => {
                    return <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 items-end p-2 rounded-md border-2 odd:bg-slate-50 even:bg-transparent odd:dark:bg-slate-900 even:dark:bg-transparent border-slate-200 dark:border-slate-700">
                        {modelSelectRow.map(modelSelectInput => {
                            return <div className="max-w-min">
                                <ModelSelectGenerator
                                    formGroupType="creation"
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
                            </div>
                        })}
                    </div>
                })}
            </FormContext.Provider>

            <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text={submitText} type="submit" handleClick={(event: any) => {
                event.preventDefault();
                handleSubmit();
            }} />
        </DataForm>
    )
}