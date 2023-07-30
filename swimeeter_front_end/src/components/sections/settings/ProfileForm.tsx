import { useContext, useEffect, useId } from "react";

import { TextInput } from "../../utilities/inputs/TextInput.tsx";
import { AppContext, UserState } from "../../../App.tsx";
import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function ProfileForm({ editAllowed, dispatch }: {
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
            "-email-text-field",
            "-first_name-text-field",
            "-last_name-text-field",
            "-prefix-text-field",
            "-suffix-text-field",
            "-middle_initials-text-field",
        ]

        for (const inputId of inputIdArray) {
            const inputElement = document.getElementById(idPrefix + inputId) as HTMLInputElement;
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
            <InputLabel inputId={idPrefix + "-email-text-field"} text="Email" />
            <TextInput regex={/[A-Za-z0-9\@\.]*/} defaultText={userState.profile?.email} pixelWidth={300} idPrefix={idPrefix + "-email"} />

            <InputLabel inputId={idPrefix + "-first_name-text-field"} text="First name" />
            <TextInput regex={/[A-Za-z0-9\@\.]*/} defaultText={userState.profile?.email} pixelWidth={150} idPrefix={idPrefix + "-first_name"} />

            <InputLabel inputId={idPrefix + "-last_name-text-field"} text="Last name" />
            <TextInput regex={/[A-Za-z0-9\@\.]*/} defaultText={userState.profile?.email} pixelWidth={150} idPrefix={idPrefix + "-last_name"} />

            <InputLabel inputId={idPrefix + "-prefix-text-field"} text="Prefix" />
            <TextInput regex={/[A-Za-z0-9\@\.]*/} defaultText={userState.profile?.email} pixelWidth={100} idPrefix={idPrefix + "-prefix"} />

            <InputLabel inputId={idPrefix + "-suffix-text-field"} text="Suffix" />
            <TextInput regex={/[A-Za-z0-9\@\.]*/} defaultText={userState.profile?.email} pixelWidth={100} idPrefix={idPrefix + "-suffix"} />

            <InputLabel inputId={idPrefix + "-middle_initials-text-field"} text="Middle initials" />
            <TextInput regex={/[A-Za-z0-9\@\.]*/} defaultText={userState.profile?.email} pixelWidth={100} idPrefix={idPrefix + "-middle_initials"} />

            {editAllowed
                ? <>
                    <InputButton idPrefix={idPrefix} color="green" text="Save changes" type="submit" handleClick={formSubmit} />
                    <InputButton idPrefix={idPrefix} color="red" text="Cancel" type="button" handleClick={formCancel} />
                </>
                : userState.logged_in && <InputButton idPrefix={idPrefix} color="purple" text="Edit profile" type="button" handleClick={formEdit}/>
            }
        </form>
    )
}