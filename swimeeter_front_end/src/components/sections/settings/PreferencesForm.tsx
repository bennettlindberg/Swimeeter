import { useContext, useEffect, useId, useReducer } from "react";
import axios from "axios";

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
        const rawData = {
            screen_mode: (document.getElementById(idPrefix + "-screen_mode-select-field") as HTMLInputElement).value,
            data_entry_information: (document.getElementById(idPrefix + "-data_entry_information-select-field") as HTMLInputElement).value,
            destructive_action_confirms: (document.getElementById(idPrefix + "-destructive_action_confirms-select-field") as HTMLInputElement).value,
            motion_safe: (document.getElementById(idPrefix + "-motion_safe-select-field") as HTMLInputElement).value
        }

        console.log(rawData)

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

        console.log(formattedData)

        // @ send preferences data to the back-end
        try {
            const response = await axios.put('/auth/update_preferences/', formattedData);

            if (response.status !== 200) {
                formDispatch({
                    type: "SAVE_FAILURE",
                    error: {
                        title: "UNKNOWN ERROR",
                        description: "An unknown error ocurred while attempting to submit the form."
                    }
                })
            }
        } catch (error) {
            // ? update preferences failed on the back-end
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data.reason);
            } else {
                console.error(error);
            }

            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "UNKNOWN ERROR",
                    description: "An unknown error ocurred while attempting to submit the form."
                }
            })
        }

        // * update user state
        userDispatch({
            type: "UPDATE_PREFERENCES",
            preferences: formattedData
        })

        formDispatch({
            type: "SAVE_SUCCESS"
        })
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
                    <InputButton idPrefix={idPrefix} color="green" icon="CIRCLE_CHECK" text="Save changes" type="submit" handleClick={(event: any) => {
                        event.preventDefault();
                        handleSubmit();
                    }} />
                    <InputButton idPrefix={idPrefix} color="red" icon="CIRCLE_CROSS" text="Cancel" type="button" handleClick={handleCancel} />
                </div>
                : <InputButton idPrefix={idPrefix} color="purple" icon="RULER_PEN" text="Edit preferences" type="button" handleClick={handleEdit} />
            }
        </DataForm>
    )
}