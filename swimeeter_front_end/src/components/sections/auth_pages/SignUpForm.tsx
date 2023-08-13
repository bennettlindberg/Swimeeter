import { useContext, useId, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AppContext, UserAction } from "../../../App.tsx";
import { ErrorType } from "../../utilities/helpers/formTypes.ts"

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";

import { MainContentSubheading } from "../../utilities/main_content/MainContentSubheading.tsx";

import { DataForm } from "../../utilities/forms/DataForm.tsx";
import { CreationFormGroup } from "../../utilities/forms/CreationFormGroup.tsx";
import { ErrorPane } from "../../utilities/forms/ErrorPane.tsx";

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
export function SignUpForm({ forwardTo }: { forwardTo?: string }) {
    // * initialize context, state, and id
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
            first_name: string,
            last_name: string,
            middle_initials: string,
            prefix: string,
            suffix: string
        } = {
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            middle_initials: "",
            prefix: "",
            suffix: ""
        }

        let repeatPassword = "";
        try {
            const emailField = document.getElementById(idPrefix + "-email-text-field") as HTMLInputElement;
            rawData.email = emailField.value;

            const passwordField = document.getElementById(idPrefix + "-password-text-field") as HTMLInputElement;
            rawData.password = passwordField.value;

            const repeatPasswordField = document.getElementById(idPrefix + "-repeat_password-text-field") as HTMLInputElement;
            repeatPassword = repeatPasswordField.value;

            const firstNameField = document.getElementById(idPrefix + "-first_name-text-field") as HTMLInputElement;
            rawData.first_name = firstNameField.value;

            const lastNameField = document.getElementById(idPrefix + "-last_name-text-field") as HTMLInputElement;
            rawData.last_name = lastNameField.value;

            const middleInitialsField = document.getElementById(idPrefix + "-middle_initials-text-field") as HTMLInputElement;
            rawData.middle_initials = middleInitialsField.value;

            const prefixField = document.getElementById(idPrefix + "-prefix-text-field") as HTMLInputElement;
            rawData.prefix = prefixField.value;

            const suffixField = document.getElementById(idPrefix + "-suffix-text-field") as HTMLInputElement;
            rawData.suffix = suffixField.value;
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

        const validPassword = /^[A-Za-z0-9\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]*$/.test(rawData.password) && /[A-Z]+/.test(rawData.password) && /[a-z]+/.test(rawData.password) && /[0-9]+/.test(rawData.password) && /[\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]+/.test(rawData.password) && rawData.password.length >= 8;
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
        // $ confirm repeat password is identical
        if (rawData.password !== repeatPassword) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "PASSWORD FIELD ERROR",
                    description: "The passwords entered in the password and repeat password fields do not match.",
                    fields: "Password, Repeat Password",
                    recommendation: "Alter the entered passwords to match each other."
                }
            });
            return;
        }

        const validFirstName = /^[A-Za-z\'\-]+$/.test(rawData.first_name);
        // ? first name format is invalid
        if (!validFirstName) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "FIRST NAME FIELD ERROR",
                    description: "The entered first name violates the constraints set on the first name field. First names must be at least 1 character long and contain only alphabetic characters, apostrophes, and hyphens.",
                    fields: "First name",
                    recommendation: "Alter the entered first name to conform to the requirements of the field."
                }
            });
            return;
        }

        const validLastName = /^[A-Za-z\'\-]+$/.test(rawData.last_name);
        // ? last name format is invalid
        if (!validLastName) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "LAST NAME FIELD ERROR",
                    description: "The entered last name violates the constraints set on the last name field. Last names must be at least 1 character long and contain only alphabetic characters, apostrophes, and hyphens.",
                    fields: "Last name",
                    recommendation: "Alter the entered last name to conform to the requirements of the field."
                }
            });
            return;
        }

        const validMiddleInitials = rawData.middle_initials === "" || /^[A-Z]( [A-Z])*$/.test(rawData.middle_initials);
        // ? middle initials format is invalid
        if (!validMiddleInitials) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "MIDDLE INITIALS FIELD ERROR",
                    description: "The entered middle initials violate the constraints set on the middle initials field. Middle initials strings must contain only space-separated, uppercase alphabetic characters.",
                    fields: "Middle initials",
                    recommendation: "Alter the entered middle initials to conform to the requirements of the field or leave the optional field blank."
                }
            });
            return;
        }

        const validPrefix = rawData.prefix === "" || /^[A-Za-z\.\-\']+$/.test(rawData.prefix);
        // ? prefix format is invalid
        if (!validPrefix) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "PREFIX FIELD ERROR",
                    description: "The entered prefix violates the constraints set on the prefix field. Prefixes must be at least 1 character long and contain only alphabetic characters, apostrophes, hyphens, and periods.",
                    fields: "Prefix",
                    recommendation: "Alter the entered prefix to conform to the requirements of the field or leave the optional field blank."
                }
            });
            return;
        }

        const validSuffix = rawData.suffix === "" || /^[A-Za-z\.\-\']+$/.test(rawData.suffix);
        // ? suffix format is invalid
        if (!validSuffix) {
            formDispatch({
                type: "SAVE_FAILURE",
                error: {
                    title: "SUFFIX FIELD ERROR",
                    description: "The entered suffix violates the constraints set on the suffix field. Suffixes must be at least 1 character long and contain only alphabetic characters, apostrophes, hyphens, and periods.",
                    fields: "Suffix",
                    recommendation: "Alter the entered suffix to conform to the requirements of the field or leave the optional field blank."
                }
            });
            return;
        }

        // @ send sign up data to the back-end
        try {
            const response = await axios.post('/auth/sign_up/', rawData);

            // * update user state
            userDispatch({
                type: "SIGN_UP",
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
                                description: "You are already logged into an account. Log out before signing up for another account.",
                                recommendation: "Log out of the current account using the log out button found in the navigation bar."
                            }
                        });
                        return;

                    case "user with email already exists":
                    case "user account already exists":
                        formDispatch({
                            type: "SAVE_FAILURE",
                            error: {
                                title: "AUTHORIZATION ERROR",
                                description: "An account associated with the entered email address already exists. Use the log in page to sign into the account",
                                fields: "Email",
                                recommendation: "Log into the account with the entered email address using the log in button found in the navigation bar. If you are attempting to associate a new account with the entered email address, first permanently delete the existing account."
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

            <MainContentSubheading subheading="Credentials" />

            <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-email-text-field"} text="Email" />}
                optional={false}
                field={<TextInput
                    regex={/^[A-Za-z0-9\.\@]*$/}
                    placeholderText="Email"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-email"}
                />}
                createInfo={{
                    title: "EMAIL",
                    description: "The email field should contain a valid email address to be associated with the account. This field cannot be changed after account creation.",
                    permitted_values: "Any email address containing alphanumeric strings, a single @ symbol, no consecutive periods, and no periods at the start or end of alphanumeric strings.",
                    warning: "Email addresses are considered case-insensitive. Emails such as A@A.com and a@a.com will refer to the same email address."
                }}
            />

            <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-password-text-field"} text="Password" />}
                optional={false}
                field={<TextInput
                    regex={/^[A-Za-z0-9\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]*$/}
                    placeholderText="Password"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-password"}
                    isPassword={true}
                />}
                createInfo={{
                    title: "PASSWORD",
                    description: "The password field should contain a password to be associated with the account. This field can be changed after account creation.",
                    permitted_values: "Any string at least 8 characters long containing at least one uppercase character (A-Z), one lowercase character (a-z), one number (0-9), and one special character (~`! @#$%^&*()_-+={[}]|\\:;\"\'<,>.?/)."
                }}
            />

            <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-repeat_password-text-field"} text="Repeat Password" />}
                optional={false}
                field={<TextInput
                    regex={/^[A-Za-z0-9\~\`\! \@\#\$\%\^\&\*\(\)\_\-\+\=\{\[\}\]\|\\\:\;\"\'\<\,\>\.\?\/]*$/}
                    placeholderText="Password"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-repeat_password"}
                    isPassword={true}
                />}
                createInfo={{
                    title: "REPEAT PASSWORD",
                    description: "The repeat password field should contain the same password as provided above. The purpose of the repeat password field is to ensure that the user has entered their password as they intend.",
                    permitted_values: "The same string as provided in the password field above."
                }}
            />

            <MainContentSubheading subheading="Name (required)" />

            <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-first_name-text-field"} text="First name" />}
                optional={false}
                field={<TextInput
                    regex={/^[A-Za-z\'\-]*$/}
                    placeholderText="First name"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-first_name"}
                />}
                createInfo={{
                    title: "FIRST NAME",
                    description: "The first name field should contain the account owner's given name.",
                    permitted_values: "Any string at least 1 character long containing alphabetic characters, apostrophes, and hyphens."
                }}
            />

            <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-last_name-text-field"} text="Last name" />}
                optional={false}
                field={<TextInput
                    regex={/^[A-Za-z\'\-]*$/}
                    placeholderText="Last name"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-last_name"}
                />}
                createInfo={{
                    title: "LAST NAME",
                    description: "The last name field should contain the account owner's family name.",
                    permitted_values: "Any string at least 1 character long containing alphabetic characters, apostrophes, and hyphens."
                }}
            />

            <MainContentSubheading subheading="Name (optional)" />

            <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-middle_initials-text-field"} text="Middle initials" />}
                optional={true}
                field={<TextInput
                    regex={/^[A-Z ]*$/}
                    placeholderText="Middle initials"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-middle_initials"}
                />}
                createInfo={{
                    title: "MIDDLE INITIALS",
                    description: "The middle initials field should contain a space-separated list of uppercase middle initials.",
                    permitted_values: "Empty, or any string at least 1 character long containing space-separated uppercase alphabetic characters."
                }}
            />

            <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-prefix-text-field"} text="Prefix" />}
                optional={true}
                field={<TextInput
                    regex={/^[A-Za-z\'\-\.]*$/}
                    placeholderText="Prefix"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-prefix"}
                />}
                createInfo={{
                    title: "PREFIX",
                    description: "The prefix field should contain any special prefixes included in the account owner's name.",
                    common_values: "\"St.\", \"Sir.\" This field is not intended for \"Mr.\", \"Mrs.\", and \"Ms.\" prefixes.",
                    permitted_values: "Empty, or any string at least 1 character long containing alphabetic characters, apostrophes, hyphens, and periods."
                }}
            />

            <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-suffix-text-field"} text="Suffix" />}
                optional={true}
                field={<TextInput
                    regex={/^[A-Za-z\'\-\.]*$/}
                    placeholderText="Suffix"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-suffix"}
                />}
                createInfo={{
                    title: "SUFFIX",
                    description: "The suffix field should contain any special suffixes included in the account owner's name.",
                    common_values: "\"Jr.\", \"Sr.\", \"III\"",
                    permitted_values: "Empty, or any string at least 1 character long containing alphabetic characters, apostrophes, hyphens, and periods."
                }}
            />

            <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text="Sign up" type="submit" handleClick={(event: any) => {
                event.preventDefault();
                handleSubmit();
            }} />
        </DataForm>
    )
}