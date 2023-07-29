import { useContext, useEffect, useId } from "react";

import { AppContext, UserState } from "../../../App.tsx";
import { InputLabel } from "./InputLabel.tsx";
import { SubmitButton } from "../inputs/SubmitButton.tsx";
import { PageButton } from "../general/PageButton.tsx";
import { SearchSelect } from "../inputs/SearchSelect.tsx";

// ~ component
export function PreferencesForm({ editAllowed, dispatch }: {
    editAllowed: boolean,
    dispatch: React.Dispatch<any>
}) {
    // * initialize context
    const { userState }: { userState: UserState } = useContext(AppContext);

    // * generate id prefix
    const idPrefix = useId();

    // * disable all inputs if edit disallowed
    useEffect(() => {
        if (editAllowed) {
            return;
        }

        const inputIdArray = [
            "-screen_mode-select-field",
            "-data_entry_information-select-field",
            "-data_entry_warnings-select-field",
            "-destructive_action_confirms-select-field",
            "-motion_safe-select-field",
        ]

        for (const inputId of inputIdArray) {
            const inputElement = document.getElementById(idPrefix + inputId) as HTMLInputElement;
            console.log(inputElement);
            if (inputElement == null) {return}
            inputElement.readOnly = true;
        }
    }, []);

    // * define submission handler
    function formSubmit() {
        // ~ todo: form submit

        dispatch({
            type: "SAVE_CLICKED"
        })
    }

    // * define cancel handler
    function formCancel() {
        dispatch({
            type: "CANCEL_CLICKED"
        })
    }

    // * define edit handler
    function formEdit() {
        dispatch({
            type: "EDIT_CLICKED"
        })
    }

    return (
        <form>
            
            <InputLabel inputId={idPrefix + "-screen_mode-select-field"} text="Preferred screen mode" />
            <SearchSelect 
                regex={/^(S(e(l(e(c(t?)?)?)?)?)?)?$|^(D(a(r(k?)?)?)?)?$|^(L(i(g(h(t?)?)?)?)?)?$/} 
                otherEnabled={false} 
                pixelWidth={100} 
                idPrefix={idPrefix + "-screen_mode"} 
                defaultText={userState.preferences.screen_mode == "system" ? "System" : userState.preferences.screen_mode == "dark" ? "Dark" : "Light"}
                options={["System", "Light", "Dark"]}
            />

            <InputLabel inputId={idPrefix + "-data_entry_information-select-field"} text="Display data entry information buttons" />
            <SearchSelect 
                regex={/^(Y(e(s?)?)?)?$|^(N(o?)?)?$/} 
                otherEnabled={false} 
                pixelWidth={100} 
                idPrefix={idPrefix + "-data_entry_information"} 
                defaultText={userState.preferences.data_entry_information ? "Yes" : "No"}
                options={["Yes", "No"]}
            />

            <InputLabel inputId={idPrefix + "-data_entry_warnings-select-field"} text="Display data entry warning buttons" />
            <SearchSelect 
                regex={/^(Y(e(s?)?)?)?$|^(N(o?)?)?$/} 
                otherEnabled={false} 
                pixelWidth={100} 
                idPrefix={idPrefix + "-data_entry_warnings"} 
                defaultText={userState.preferences.data_entry_warnings ? "Yes" : "No"}
                options={["Yes", "No"]}
            />

            <InputLabel inputId={idPrefix + "-destructive_action_confirms-select-field"} text="Display destructive action confirmation pop-ups" />
            <SearchSelect 
                regex={/^(Y(e(s?)?)?)?$|^(N(o?)?)?$/} 
                otherEnabled={false} 
                pixelWidth={100} 
                idPrefix={idPrefix + "-destructive_action_confirms"} 
                defaultText={userState.preferences.destructive_action_confirms ? "Yes" : "No"}
                options={["Yes", "No"]}
            />

            <InputLabel inputId={idPrefix + "-motion_safe-select-field"} text="Motion effects" />
            <SearchSelect 
                regex={/^(Y(e(s?)?)?)?$|^(N(o?)?)?$/} 
                otherEnabled={false} 
                pixelWidth={100} 
                idPrefix={idPrefix + "-motion_safe"} 
                defaultText={userState.preferences.motion_safe ? "Yes" : "No"}
                options={["Yes", "No"]}
            />

            {editAllowed
                ? <>
                    <SubmitButton idPrefix={idPrefix} color="green" text="Save changes" handleClick={formSubmit} />
                    <SubmitButton idPrefix={idPrefix} color="red" text="Cancel" handleClick={formCancel} />
                </>
                : <PageButton color="purple" text="Edit preferences" handleClick={formEdit}/>
            }
        </form>
    )
}