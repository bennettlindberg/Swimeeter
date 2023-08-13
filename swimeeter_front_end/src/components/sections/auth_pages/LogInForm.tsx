import { useContext, useId, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AppContext, UserAction } from "../../../App.tsx";
import { ErrorType } from "../../utilities/helpers/formTypes.ts"

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";

import { DataForm } from "../../utilities/forms/DataForm.tsx";
import { ErrorPane } from "../../utilities/forms/ErrorPane.tsx";
import { NeutralFormGroup } from "../../utilities/forms/NeutralFormGroup.tsx";

// * define form types
type FormState = {
    error: ErrorType | null
}

type FormAction = {
    type: "SAVE_SUCCESS" | "DISMISS_ERROR"
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
                error: null,
            } as FormState;

        case "SAVE_FAILURE":
            return {
                error: action.error,
            } as FormState;

        default:
            return state;
    }
}

// ~ component
export function LogInForm({ forwardTo }: { forwardTo?: string }) {
    // * initialize context, state, id, and navigation
    const { userDispatch }: { userDispatch: React.Dispatch<UserAction> } = useContext(AppContext);
    const [formState, formDispatch] = useReducer(formReducer, { error: null });
    const idPrefix = useId();
    const navigate = useNavigate();

    // * define form handlers
    async function handleSubmit() {
        // * retrieve raw data
        let rawData: {
            email: string
            password: string,
        } = {
            email: "",
            password: "",
        }

        try {
            const emailField = document.getElementById(idPrefix + "-email-text-field") as HTMLInputElement;
            rawData.email = emailField.value;

            const passwordField = document.getElementById(idPrefix + "-password-text-field") as HTMLInputElement;
            rawData.password = passwordField.value;
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
        const validEmail = /^[A-Za-z0-9]+(\.[A-Za-z0-9]+)*\@[A-Za-z0-9]+(\.[A-Za-z0-9]+)+$/.test(rawData.email);
        // ? email format is invalid
        if (!validEmail) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "EMAIL FIELD ERROR",
                    description: "The entered email violates the constraints set on the email field. Emails must contain only alphanumeric characters, a single @ symbol, and non-consecutive periods embedded within alphanumeric strings.",
                    fields: "Email",
                    recommendation: "Alter the entered email to conform to the requirements of the field."
                }
            });
            return;
        }
        // $ convert email to lowercase
        rawData.email = rawData.email.toLowerCase();

        const validPassword = /^[A-Za-z0-9\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]*$/.test(rawData.password) && /[A-Z]+/.test(rawData.password) && /[a-z]+/.test(rawData.password) && /[0-9]+/.test(rawData.password) && /[\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]+/.test(rawData.password);
        // ? password format is invalid
        if (!validPassword) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "PASSWORD FIELD ERROR",
                    description: "The entered password violates the constraints set on the password field. Passwords must be at least 8 characters long and contain at least one uppercase character (A-Z), one lowercase character (a-z), one number (0-9), and one special character (~`! @#$%^&*()_-+={[}]|\\:;\"\'<,>.?/).",
                    fields: "Password",
                    recommendation: "Alter the entered password to conform to the requirements of the field."
                }
            });
            return;
        }

        // @ send log in data to the back-end
        try {
            const response = await axios.post('/auth/log_in/', rawData);

            // * update user state
            userDispatch({
                type: "LOG_IN",
                profile: response.data.profile,
                preferences: response.data.preferences
            });

            formDispatch({
                type: "SAVE_SUCCESS"
            });

            navigate(forwardTo || "/", { replace: true });
        } catch (error) {
            // ? back-end error
            if (axios.isAxiosError(error)) {
                switch (error.response?.data) {
                    case "user already logged in":
                        formDispatch({
                            type: "SAVE_FAILURE",
                            error: {
                                title: "AUTHORIZATION ERROR",
                                description: "You are already logged into an account. Log out before logging into another account.",
                                recommendation: "Log out of the current account using the log out button found in the navigation bar."
                            }
                        });
                        return;

                    case "user account does not exist":
                        formDispatch({
                            type: "SAVE_FAILURE",
                            error: {
                                title: "AUTHENTICATION ERROR",
                                description: "The entered email and password combination did not match any existing Swimeeter accounts.",
                                fields: "Email, Password",
                                recommendation: "Check that the entered email and password are spelled correctly and retry logging in. If you are trying to create a new account, use the sign in page instead."
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

            <NeutralFormGroup
                label={<InputLabel inputId={idPrefix + "-email-text-field"} text="Email" />}
                field={<TextInput
                    regex={/^[A-Za-z0-9\.\@]*$/}
                    placeholderText="Email"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-email"}
                />}
                info={{
                    title: "EMAIL",
                    description: "The email field should contain the email address used to create the account. This field cannot be changed after account creation.",
                    permitted_values: "Any email address containing alphanumeric strings, a single @ symbol, no consecutive periods, and no periods at the start or end of alphanumeric strings.",
                    warning: "Email addresses are considered case-insensitive. Emails such as A@A.com and a@a.com will refer to the same email address."
                }}
            />

            <NeutralFormGroup
                label={<InputLabel inputId={idPrefix + "-password-text-field"} text="Password" />}
                field={<TextInput
                    regex={/^[A-Za-z0-9\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]*$/}
                    placeholderText="Password"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-password"}
                    isPassword={true}
                />}
                info={{
                    title: "PASSWORD",
                    description: "The password field should contain the current password associated with the account. This field can be changed after account creation.",
                    permitted_values: "Any string at least 8 characters long containing at least one uppercase character (A-Z), one lowercase character (a-z), one number (0-9), and one special character (~`! @#$%^&*()_-+={[}]|\\:;\"\'<,>.?/)."
                }}
            />

            <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text="Log in" type="submit" handleClick={(event: any) => {
                event.preventDefault();
                handleSubmit();
            }} />
        </DataForm>
    )
}