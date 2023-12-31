import { useContext, useEffect, useId, useReducer } from "react";
import axios from "axios";

import { AppContext, UserAction, UserState } from "../../../App.tsx";
import { ErrorType } from "../../utilities/helpers/formTypes.ts"

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { InputButton } from "../../utilities/inputs/InputButton.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";

import { DataForm } from "../../utilities/forms/DataForm.tsx";
import { ErrorPane } from "../../utilities/forms/ErrorPane.tsx";
import { EditingFormGroup } from "../../utilities/forms/EditingFormGroup.tsx";
import { FormContext } from "../../utilities/helpers/formHelpers.ts";

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
export function ProfileForm({ scrollRef }: { scrollRef: React.RefObject<HTMLHeadingElement> }) {
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
            "-first_name-text-field",
            "-last_name-text-field",
            "-middle_initials-text-field",
            "-prefix-text-field",
            "-suffix-text-field",
        ]

        for (const inputId of inputIdArray) {
            const inputElement = document.getElementById(idPrefix + inputId) as HTMLInputElement;
            inputElement.readOnly = setTo;
        }
    }, [formState.mode]);

    // * define form handlers
    async function handleSubmit() {
        scrollRef.current?.scrollIntoView();

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

        try {
            const firstNameField = document.getElementById(idPrefix + "-first_name-text-field") as HTMLInputElement;
            rawData.first_name = firstNameField.value;

            const lastNameField = document.getElementById(idPrefix + "-last_name-text-field") as HTMLInputElement;
            rawData.last_name = lastNameField.value;

            const middleInitialsField = document.getElementById(idPrefix + "-middle_initials-text-field") as HTMLInputElement;
            rawData.middle_initials = middleInitialsField.value.trim();

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
        scrollRef.current?.scrollIntoView();

        formDispatch({
            type: "CANCEL_CLICKED"
        })
    }

    function handleEdit() {
        scrollRef.current?.scrollIntoView();

        formDispatch({
            type: "EDIT_CLICKED"
        })
    }

    return (
        <DataForm>
            {formState.error && <ErrorPane error={formState.error} handleXClick={() => formDispatch({ type: "DISMISS_ERROR" })} />}

            <FormContext.Provider value={formState.mode === "edit"}>
                <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 items-end p-2 rounded-md border-2 odd:bg-slate-50 even:bg-transparent odd:dark:bg-slate-900 even:dark:bg-transparent border-slate-200 dark:border-slate-700">
                    <div className="max-w-min min-w-[300px]">
                        <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-first_name-text-field"} text="First name" />}
                            optional={false}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-]*$/}
                                placeholderText="First name"
                                defaultText={userState.profile?.first_name}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-first_name"}
                            />}
                            editInfo={{
                                title: "FIRST NAME",
                                description: "The first name field should contain the account owner's given name.",
                                permitted_values: "Any string at least 1 character long containing alphabetic characters, apostrophes, and hyphens."
                            }}
                            viewInfo={{
                                title: "FIRST NAME",
                                description: "The first name field contains the account owner's given name.",
                            }}
                        />
                    </div>
                    <div className="max-w-min min-w-[300px]">
                        <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-last_name-text-field"} text="Last name" />}
                            optional={false}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-]*$/}
                                placeholderText="Last name"
                                defaultText={userState.profile?.last_name}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-last_name"}
                            />}
                            editInfo={{
                                title: "LAST NAME",
                                description: "The last name field should contain the account owner's family name.",
                                permitted_values: "Any string at least 1 character long containing alphabetic characters, apostrophes, and hyphens."
                            }}
                            viewInfo={{
                                title: "LAST NAME",
                                description: "The last name field contains the account owner's family name.",
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 items-end p-2 rounded-md border-2 odd:bg-slate-50 even:bg-transparent odd:dark:bg-slate-900 even:dark:bg-transparent border-slate-200 dark:border-slate-700">
                    <div className="max-w-min min-w-[300px]">
                        <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-middle_initials-text-field"} text="Middle initials" />}
                            optional={true}
                            field={<TextInput
                                regex={/^([A-Z] )*$|^([A-Z] )*[A-Z]?$/}
                                placeholderText="None"
                                defaultText={userState.profile?.middle_initials}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-middle_initials"}
                            />}
                            editInfo={{
                                title: "MIDDLE INITIALS",
                                description: "The middle initials field should contain a space-separated list of the account owner's uppercase middle initials.",
                                permitted_values: "Any string at least 1 character long containing space-separated uppercase alphabetic characters. May be left blank."
                            }}
                            viewInfo={{
                                title: "MIDDLE INITIALS",
                                description: "The middle initials field contains a space-separated list of account owner's uppercase middle initials.",
                            }}
                        />
                    </div>
                    <div className="max-w-min min-w-[300px]">
                        <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-prefix-text-field"} text="Prefix" />}
                            optional={true}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-\.]*$/}
                                placeholderText="None"
                                defaultText={userState.profile?.prefix}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-prefix"}
                            />}
                            editInfo={{
                                title: "PREFIX",
                                description: "The prefix field should contain any special prefixes included in the account owner's name.",
                                common_values: "\"St.\", \"Sir.\" This field is not intended for \"Mr.\", \"Mrs.\", and \"Ms.\" prefixes.",
                                permitted_values: "Any string at least 1 character long containing alphabetic characters, apostrophes, hyphens, and periods. May be left blank."
                            }}
                            viewInfo={{
                                title: "PREFIX",
                                description: "The prefix field contains any special prefixes included in the account owner's name.",
                            }}
                        />
                    </div>
                    <div className="max-w-min min-w-[300px]">
                        <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-suffix-text-field"} text="Suffix" />}
                            optional={true}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-\.]*$/}
                                placeholderText="None"
                                defaultText={userState.profile?.suffix}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-suffix"}
                            />}
                            editInfo={{
                                title: "SUFFIX",
                                description: "The suffix field should contain any special suffixes included in the account owner's name.",
                                common_values: "\"Jr.\", \"Sr.\", \"III\"",
                                permitted_values: "Any string at least 1 character long containing alphabetic characters, apostrophes, hyphens, and periods. May be left blank."
                            }}
                            viewInfo={{
                                title: "SUFFIX",
                                description: "The suffix field contains any special suffixes included in the account owner's name.",
                            }}
                        />
                    </div>
                </div>
            </FormContext.Provider>

            {
                formState.mode === "edit"
                    ? <div className="flex flex-row flex-wrap gap-x-2">
                        <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="CIRCLE_CHECK" text="Save changes" type="submit" handleClick={(event: any) => {
                            event.preventDefault();
                            handleSubmit();
                        }} />
                        <InputButton idPrefix={idPrefix + "-cancel"} color="red" icon="CIRCLE_CROSS" text="Cancel" type="button" handleClick={handleCancel} />
                    </div>
                    : <InputButton idPrefix={idPrefix + "-edit"} color="purple" icon="CIRCLE_BOLT" text="Edit profile" type="button" handleClick={handleEdit} />
            }
        </DataForm >
    )
}