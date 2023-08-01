import { useContext, useEffect, useId, useReducer } from "react";
import axios from "axios";

import { convertRawData } from "../../utilities/forms/formHelpers.ts";

import { AppContext, UserAction, UserState } from "../../../App.tsx";
import { ErrorType } from "../../utilities/forms/FormTypes.tsx"

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { SearchSelect } from "../../utilities/inputs/SearchSelect.tsx";

import { DataForm } from "../../utilities/forms/DataForm.tsx";
import { FormGroup } from "../../utilities/forms/FormGroup.tsx";
import { ErrorPane } from "../../utilities/forms/ErrorPane.tsx";

// * define form types
type FormState = {
    mode: "view" | "edit"
    error: ErrorType | null
}

type FormAction = {
    type: "EDIT_CLICKED" | "SAVE_SUCCESS" | "CANCEL_CLICKED" | "DISMISS_ERROR"
} | {
    type: "SAVE_FAILURE",
    error: ErrorType
}

// * define form reducer
function formReducer(state: FormState, action: FormAction) {
    switch (action.type) {
        case "EDIT_CLICKED":
            return {
                error: null,
                mode: "edit"
            } as FormState;

        case "SAVE_SUCCESS":
        case "CANCEL_CLICKED":
            return {
                error: null,
                mode: "view"
            } as FormState;

        case "SAVE_FAILURE":
            return {
                error: action.error,
                mode: "edit"
            } as FormState;

        case "DISMISS_ERROR":
            return {
                error: null,
                mode: "edit"
            } as FormState;

        default:
            return state;
    }
}

// ~ component
export function PreferencesForm() {
    // * initialize context, state, and id
    const { userState, userDispatch }: {
        userState: UserState,
        userDispatch: React.Dispatch<UserAction>
    } = useContext(AppContext);
    const [formState, formDispatch] = useReducer(formReducer, {
        mode: "view",
        error: null,
    });
    const idPrefix = useId();

    // * disable all inputs if view only
    useEffect(() => {
        let setTo = true;
        if (formState.mode === "edit") {
            setTo = false;
        }

        const inputIdArray = [
            "-screen_mode-select-field",
            "-data_entry_information-select-field",
            "-destructive_action_confirms-select-field",
            "-motion_safe-select-field",
        ]

        for (const inputId of inputIdArray) {
            const inputElement = document.getElementById(idPrefix + inputId) as HTMLInputElement;
            inputElement.readOnly = setTo;
        }
    }, [formState.mode]);

    // * define form handlers
    async function handleSubmit() {
        // * retrieve raw data
        let rawData: {
            screen_mode: string
            data_entry_information: string,
            destructive_action_confirms: string,
            motion_safe: string
        } = {
            screen_mode: "System",
            data_entry_information: "Yes",
            destructive_action_confirms: "Yes",
            motion_safe: "Yes"
        }

        try {
            const screenModeField = document.getElementById(idPrefix + "-screen_mode-select-field") as HTMLInputElement;
            rawData.screen_mode = screenModeField.value;

            const dataEntryInformationField = document.getElementById(idPrefix + "-data_entry_information-select-field") as HTMLInputElement;
            rawData.data_entry_information = dataEntryInformationField.value;

            const destructiveActionConfirmsField = document.getElementById(idPrefix + "-destructive_action_confirms-select-field") as HTMLInputElement;
            rawData.destructive_action_confirms = destructiveActionConfirmsField.value;

            const motionSafeField = document.getElementById(idPrefix + "-motion_safe-select-field") as HTMLInputElement;
            rawData.motion_safe = motionSafeField.value;
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

        // * format raw data
        const formattedData: {
            screen_mode: "light" | "dark" | "system",
            data_entry_information: boolean,
            destructive_action_confirms: boolean,
            motion_safe: boolean
        } = {
            screen_mode: rawData.screen_mode === "System" ? "system" : rawData.screen_mode === "Dark" ? "dark" : "light",
            data_entry_information: rawData.data_entry_information === "Yes",
            destructive_action_confirms: rawData.destructive_action_confirms === "Yes",
            motion_safe: rawData.motion_safe === "Yes"
        }

        const formattedScreenMode = convertRawData<string, "system" | "light" | "dark">(
            rawData.screen_mode,
            [
                { raw: "System", formatted: "system" },
                { raw: "Light", formatted: "light" },
                { raw: "Dark", formatted: "dark" }
            ]
        );
        if (formattedScreenMode === undefined) {
            // ? incorrect input error
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "SCREEN MODE ENTRY ERROR",
                    description: "An unexpected value was entered for the screen mode field.",
                    fields: "Screen mode",
                    recommendation: "Choose \"System\", \"Light\", or \"Dark\" as the entered value for the screen mode field."
                }
            });
            return;
        } else {
            formattedData.screen_mode = formattedScreenMode;
        }

        const formattedDataEntryInformation = convertRawData<string, boolean>(
            rawData.data_entry_information,
            [
                { raw: "Yes", formatted: true },
                { raw: "No", formatted: false }
            ]
        );
        if (formattedDataEntryInformation === undefined) {
            // ? incorrect input error
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "DATA ENTRY INFORMATION ENTRY ERROR",
                    description: "An unexpected value was entered for the display data entry information field.",
                    fields: "Display data entry information",
                    recommendation: "Choose \"Yes\" or \"No\" as the entered value for the display data entry information field."
                }
            });
            return;
        } else {
            formattedData.data_entry_information = formattedDataEntryInformation;
        }

        const formattedDestructiveActionConfirms = convertRawData<string, boolean>(
            rawData.destructive_action_confirms,
            [
                { raw: "Yes", formatted: true },
                { raw: "No", formatted: false }
            ]
        );
        if (formattedDestructiveActionConfirms === undefined) {
            // ? incorrect input error
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "DESTRUCTIVE ACTION CONFIRMATIONS ENTRY ERROR",
                    description: "An unexpected value was entered for the display destructive action confirmations field.",
                    fields: "Display destructive action confirmations",
                    recommendation: "Choose \"Yes\" or \"No\" as the entered value for the display destructive action confirmations field."
                }
            });
            return;
        } else {
            formattedData.destructive_action_confirms = formattedDestructiveActionConfirms;
        }

        const formattedMotionSafe = convertRawData<string, boolean>(
            rawData.motion_safe,
            [
                { raw: "Yes", formatted: true },
                { raw: "No", formatted: false }
            ]
        );
        if (formattedMotionSafe === undefined) {
            // ? incorrect input error
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "MOTION EFFECTS ENTRY ERROR",
                    description: "An unexpected value was entered for the use motion effects field.",
                    fields: "Use motion effects",
                    recommendation: "Choose \"Yes\" or \"No\" as the entered value for the use motion effects field."
                }
            });
            return;
        } else {
            formattedData.motion_safe = formattedMotionSafe;
        }

        // @ send preferences data to the back-end
        try {
            const response = await axios.put('/auth/update_preferences/', formattedData);

            // * update user state
            userDispatch({
                type: "UPDATE_PREFERENCES",
                preferences: formattedData
            })

            formDispatch({
                type: "SAVE_SUCCESS"
            })
        } catch (error) {
            // ? back-end error
            if (axios.isAxiosError(error)) {
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

            <FormGroup
                label={<InputLabel inputId={idPrefix + "-screen_mode-select-field"} text="Preferred screen mode" />}
                field={<SearchSelect
                    regex={/^(S(y(s(t(e(m?)?)?)?)?)?)?$|^(D(a(r(k?)?)?)?)?$|^(L(i(g(h(t?)?)?)?)?)?$/}
                    otherEnabled={false}
                    pixelWidth={100}
                    idPrefix={idPrefix + "-screen_mode"}
                    defaultText={userState.preferences.screen_mode == "system" ? "System" : userState.preferences.screen_mode == "dark" ? "Dark" : "Light"}
                    options={["System", "Light", "Dark"]}
                />}
                info={{
                    title: "PREFERRED SCREEN MODE",
                    description: "The preferred screen mode option determines if the site is displayed in light or dark mode. Use the value \"System\" to use your system's screen mode setting.",
                    permitted_values: "System, Light, Dark"
                }}
            />

            <FormGroup
                label={<InputLabel inputId={idPrefix + "-data_entry_information-select-field"} text="Display data entry information buttons" />}
                field={<SearchSelect
                    regex={/^(Y(e(s?)?)?)?$|^(N(o?)?)?$/}
                    otherEnabled={false}
                    pixelWidth={100}
                    idPrefix={idPrefix + "-data_entry_information"}
                    defaultText={userState.preferences.data_entry_information ? "Yes" : "No"}
                    options={["Yes", "No"]}
                />}
                info={{
                    title: "DATA ENTRY INFORMATION",
                    description: "The display data entry information option determines if information buttons and panes (such as this one) are displayed on site forms.",
                    permitted_values: "On, Off"
                }}
            />

            <FormGroup
                label={<InputLabel inputId={idPrefix + "-destructive_action_confirms-select-field"} text="Display destructive action confirmation pop-ups" />}
                field={<SearchSelect
                    regex={/^(Y(e(s?)?)?)?$|^(N(o?)?)?$/}
                    otherEnabled={false}
                    pixelWidth={100}
                    idPrefix={idPrefix + "-destructive_action_confirms"}
                    defaultText={userState.preferences.destructive_action_confirms ? "Yes" : "No"}
                    options={["Yes", "No"]}
                />}
                info={{
                    title: "DESTRUCTIVE ACTION CONFIRMATIONS",
                    description: "The display data entry confirmation pop-ups option determines if confirmation panes are displayed when a user\'s action may result in data destruction.",
                    permitted_values: "On, Off"
                }}
            />

            <FormGroup
                label={<InputLabel inputId={idPrefix + "-motion_safe-select-field"} text="Use motion effects" />}
                field={<SearchSelect
                    regex={/^(Y(e(s?)?)?)?$|^(N(o?)?)?$/}
                    otherEnabled={false}
                    pixelWidth={100}
                    idPrefix={idPrefix + "-motion_safe"}
                    defaultText={userState.preferences.motion_safe ? "Yes" : "No"}
                    options={["Yes", "No"]}
                />}
                info={{
                    title: "MOTION EFFECTS",
                    description: "The use motion effects option determines if applicable site components display animations. For example, setting this option to \"No\" will freeze the site\'s navigation bar waves.",
                    permitted_values: "On, Off"
                }}
            />

            {formState.mode === "edit"
                ? <div className="flex flex-row flex-wrap gap-x-2">
                    <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text="Save changes" type="submit" handleClick={(event: any) => {
                        event.preventDefault();
                        handleSubmit();
                    }} />
                    <InputButton idPrefix={idPrefix + "-cancel"} color="red" icon="CIRCLE_CROSS" text="Cancel" type="button" handleClick={handleCancel} />
                </div>
                : <InputButton idPrefix={idPrefix + "-edit"} color="purple" icon="CIRCLE_BOLT" text="Edit preferences" type="button" handleClick={handleEdit} />
            }
        </DataForm>
    )
}