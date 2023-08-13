import { useContext, useEffect, useId, useReducer } from "react";
import axios from "axios";

import { AppContext, UserAction, UserState } from "../../../App.tsx";
import { ErrorType } from "../../utilities/helpers/formTypes.ts"
import { FormContext } from "../../utilities/helpers/formHelpers.ts";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";

import { DataForm } from "../../utilities/forms/DataForm.tsx";
import { EditingFormGroup } from "../../utilities/forms/EditingFormGroup.tsx";
import { ErrorPane } from "../../utilities/forms/ErrorPane.tsx";
import { NeutralFormGroup } from "../../utilities/forms/NeutralFormGroup.tsx";

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
export function AccountForm() {
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

    // * always disable email
    useEffect(() => {
        const emailField = document.getElementById(idPrefix + "-email-text-field") as HTMLInputElement;
        emailField.readOnly = true;
    }, [formState.mode]);

    // * define form handlers
    async function handleSubmit() {
        // * retrieve raw data
        let rawData: {
            email: string
            old_password: string,
            new_password: string
        } = {
            email: userState.profile!.email,
            old_password: "",
            new_password: ""
        }

        let repeatNewPassword = "";
        try {
            const oldPasswordField = document.getElementById(idPrefix + "-old_password-text-field") as HTMLInputElement;
            rawData.old_password = oldPasswordField.value;

            const newPasswordField = document.getElementById(idPrefix + "-new_password-text-field") as HTMLInputElement;
            rawData.new_password = newPasswordField.value;

            const repeatNewPasswordField = document.getElementById(idPrefix + "-repeat_new_password-text-field") as HTMLInputElement;
            repeatNewPassword = repeatNewPasswordField.value;
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
        const validOldPassword = /^[A-Za-z0-9\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]*$/.test(rawData.old_password) && /[A-Z]+/.test(rawData.old_password) && /[a-z]+/.test(rawData.old_password) && /[0-9]+/.test(rawData.old_password) && /[\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]+/.test(rawData.old_password) && rawData.old_password.length >= 8;
        // ? old password format is invalid
        if (!validOldPassword) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "CURRENT PASSWORD FIELD ERROR",
                    description: "The entered current password violates the constraints set on the current password field. Passwords must be at least 8 characters long and contain at least one uppercase character (A-Z), one lowercase character (a-z), one number (0-9), and one special character (~`! @#$%^&*()_-+={[}]|\\:;\"\'<,>.?/).",
                    fields: "Current password",
                    recommendation: "Alter the entered current password to conform to the requirements of the field."
                }
            });
            return;
        }

        const validNewPassword = /^[A-Za-z0-9\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]*$/.test(rawData.new_password) && /[A-Z]+/.test(rawData.new_password) && /[a-z]+/.test(rawData.new_password) && /[0-9]+/.test(rawData.new_password) && /[\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]+/.test(rawData.new_password) && rawData.new_password.length >= 8;
        // ? new password format is invalid
        if (!validNewPassword) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "NEW PASSWORD FIELD ERROR",
                    description: "The entered new password violates the constraints set on the new password field. Passwords must be at least 8 characters long and contain at least one uppercase character (A-Z), one lowercase character (a-z), one number (0-9), and one special character (~`! @#$%^&*()_-+={[}]|\\:;\"\'<,>.?/).",
                    fields: "New password",
                    recommendation: "Alter the entered new password to conform to the requirements of the field."
                }
            });
            return;
        }
        // $ confirm repeat new password is identical
        if (rawData.new_password !== repeatNewPassword) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "NEW PASSWORD FIELD ERROR",
                    description: "The passwords entered in the new password and repeat new password fields do not match.",
                    fields: "New password, Repeat new password",
                    recommendation: "Alter the entered new passwords to match each other."
                }
            });
            return;
        }
        // $ confirm old and new passwords are not identical
        if (rawData.new_password === rawData.old_password) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "NEW PASSWORD FIELD ERROR",
                    description: "The passwords entered in the current password and new password fields are the same. New passwords must not match the account's current password.",
                    fields: "Current password, New password",
                    recommendation: "Alter the entered new password to be different than the current password."
                }
            });
            return;
        }

        // @ send sign up data to the back-end
        try {
            const response = await axios.put('/auth/update_profile/', rawData);

            // * update user state
            userDispatch({
                type: "UPDATE_PROFILE",
                profile: response.data.profile,
            });

            formDispatch({
                type: "SAVE_SUCCESS"
            });
        } catch (error) {
            // ? back-end error
            if (axios.isAxiosError(error)) {
                switch (error.response?.data) {
                    case "user not logged in":
                        formDispatch({
                            type: "SAVE_FAILURE",
                            error: {
                                title: "AUTHENTICATION ERROR",
                                description: "You are not logged into an account. Log into an account to alter your profile.",
                                recommendation: "Log into an account using the log in button found in the navigation bar."
                            }
                        });
                        return;

                    case "must pass current password to update password":
                        formDispatch({
                            type: "SAVE_FAILURE",
                            error: {
                                title: "CURRENT PASSWORD ERROR",
                                description: "You must provide the account's current password to change the password.",
                                recommendation: "Enter the account's current password."
                            }
                        });
                        return;

                    case "log in credentials invalid":
                        formDispatch({
                            type: "SAVE_FAILURE",
                            error: {
                                title: "AUTHENTICATION ERROR",
                                description: "The entered current password did not match the currently logged-in Swimeeter account.",
                                recommendation: "Enter the correct current password for the currently logged-in account."
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

            <NeutralFormGroup
                label={<InputLabel inputId={idPrefix + "-email-text-field"} text="Email address" />}
                field={<TextInput
                    regex={/^[A-Za-z0-9\.\@]*$/}
                    defaultText={userState.profile?.email}
                    pixelWidth={300}
                    idPrefix={idPrefix + "-email"}
                />}
                info={{
                    title: "EMAIL",
                    description: "The email field contains the email address associated with the account. The value of this field is read-only as it cannot be changed after account creation.",
                }}
            />

            {formState.mode === "edit" &&
                <FormContext.Provider value={formState.mode === "edit"}>
                    <EditingFormGroup
                        label={<InputLabel inputId={idPrefix + "-old_password-text-field"} text="Current password" />}
                        optional={false}
                        field={<TextInput
                            regex={/^[A-Za-z0-9\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]*$/}
                            placeholderText="Current password"
                            pixelWidth={300}
                            idPrefix={idPrefix + "-old_password"}
                            isPassword={true}
                        />}
                        editInfo={{
                            title: "CURRENT PASSWORD",
                            description: "The current password field should contain the password currently associated with the account.",
                            permitted_values: "The password string currently associated with the account."
                        }}
                        viewInfo={{ // ! should never be seen
                            title: "CURRENT PASSWORD",
                            description: "The current password field contains the password currently associated with the account.",
                        }}
                    />

                    <EditingFormGroup
                        label={<InputLabel inputId={idPrefix + "-new_password-text-field"} text="New password" />}
                        optional={false}
                        field={<TextInput
                            regex={/^[A-Za-z0-9\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]*$/}
                            placeholderText="New password"
                            pixelWidth={300}
                            idPrefix={idPrefix + "-new_password"}
                            isPassword={true}
                        />}
                        editInfo={{
                            title: "NEW PASSWORD",
                            description: "The new password field should contain a new password to be associated with the account. This field can be changed again after the account is edited.",
                            permitted_values: "Any string at least 8 characters long containing at least one uppercase character (A-Z), one lowercase character (a-z), one number (0-9), and one special character (~`! @#$%^&*()_-+={[}]|\\:;\"\'<,>.?/) and not equal to the current password."
                        }}
                        viewInfo={{ // ! should never be seen
                            title: "NEW PASSWORD",
                            description: "The new password field contains the new password to be associated with the account.",
                        }}
                    />

                    <EditingFormGroup
                        label={<InputLabel inputId={idPrefix + "-repeat_new_password-text-field"} text="Repeat new password" />}
                        optional={false}
                        field={<TextInput
                            regex={/^[A-Za-z0-9\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]*$/}
                            placeholderText="Repeat new password"
                            pixelWidth={300}
                            idPrefix={idPrefix + "-repeat_new_password"}
                            isPassword={true}
                        />}
                        editInfo={{
                            title: "REPEAT NEW PASSWORD",
                            description: "The repeat new password field should contain the same new password as provided above. The purpose of the repeat new password field is to ensure that the user has entered their new password as they intend.",
                            permitted_values: "The same string as provided in the new password field above."
                        }}
                        viewInfo={{ // ! should never be seen
                            title: "REPEAT NEW PASSWORD",
                            description: "The repeat new password field contains the same new password as listed above. The purpose of the repeat new password field is to ensure that the user has entered their new password as they intend.",
                        }}
                    />
                </FormContext.Provider>
            }

            {formState.mode === "edit"
                ? <div className="flex flex-row flex-wrap gap-x-2">
                    <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text="Save new password" type="submit" handleClick={(event: any) => {
                        event.preventDefault();
                        handleSubmit();
                    }} />
                    <InputButton idPrefix={idPrefix + "-cancel"} color="red" icon="CIRCLE_CROSS" text="Cancel" type="button" handleClick={handleCancel} />
                </div>
                : <InputButton idPrefix={idPrefix + "-edit"} color="purple" icon="CIRCLE_BOLT" text="Change password" type="button" handleClick={handleEdit} />
            }
        </DataForm>
    )
}