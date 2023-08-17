import { useId } from "react";

import { CreationForm } from "../../utilities/forms/CreationForm.tsx";
import { CreationFormGroup } from "../../utilities/forms/CreationFormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";

// ~ component
export function SwimmerCreationForm({ meet_id_INT }: { meet_id_INT: number }) {
    // * initialize id
    const idPrefix = useId();

    return (
        <>
            <CreationForm
                formInputFields={[
                    {
                        title: "first_name",
                        idSuffix: "-first_name-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-first_name-text-field"} text="First name" />}
                            key={idPrefix + "-first_name-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-]*$/}
                                placeholderText="First name"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-first_name"}
                            />}
                            createInfo={{
                                title: "FIRST NAME",
                                description: "The first name field should contain the given name of the swimmer being created.",
                                permitted_values: "Any string at least 1 character long containing alphabetic characters, apostrophes, and hyphens."
                            }}
                        />,
                        validator: (name: string) => {
                            if (name.length > 0) {
                                return true;
                            } else {
                                return {
                                    title: "FIRST NAME FIELD ERROR",
                                    description: "The swimmer first name field was left blank. Swimmer first names are required and must be at least 1 character in length.",
                                    fields: "First name",
                                    recommendation: "Alter the entered first name to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                    {
                        title: "last_name",
                        idSuffix: "-last_name-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-last_name-text-field"} text="Last name" />}
                            key={idPrefix + "-last_name-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-]*$/}
                                placeholderText="Last name"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-last_name"}
                            />}
                            createInfo={{
                                title: "LAST NAME",
                                description: "The last name field should contain the family name of the swimmer being created.",
                                permitted_values: "Any string at least 1 character long containing alphabetic characters, apostrophes, and hyphens."
                            }}
                        />,
                        validator: (name: string) => {
                            if (name.length > 0) {
                                return true;
                            } else {
                                return {
                                    title: "LAST NAME FIELD ERROR",
                                    description: "The swimmer last name field was left blank. Swimmer last names are required and must be at least 1 character in length.",
                                    fields: "Last name",
                                    recommendation: "Alter the entered last name to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                    {
                        title: "middle_initials",
                        idSuffix: "-middle_initials-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-middle_initials-text-field"} text="Middle initials" />}
                            key={idPrefix + "-middle_initials-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^([A-Z] )*$|^([A-Z] )*[A-Z]?$/}
                                placeholderText="Middle initials"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-middle_initials"}
                            />}
                            createInfo={{
                                title: "MIDDLE INITIALS",
                                description: "The middle initials field should contain a space-separated list of uppercase middle initials from the name of the swimmer being created.",
                                permitted_values: "Empty, or any string at least 1 character long containing space-separated uppercase alphabetic characters."
                            }}
                        />,
                        converter: (middle_initials: string) => {
                            return middle_initials.trim();
                        }
                    },
                    {
                        title: "prefix",
                        idSuffix: "-prefix-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-prefix-text-field"} text="Prefix" />}
                            key={idPrefix + "-prefix-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-\.]*$/}
                                placeholderText="Prefix"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-prefix"}
                            />}
                            createInfo={{
                                title: "PREFIX",
                                description: "The prefix field should contain any special prefixes included in the name of the swimmer being created.",
                                common_values: "\"St.,\" \"Sir.\" This field is not intended for \"Mr.,\" \"Mrs.,\" and \"Ms.\" prefixes.",
                                permitted_values: "Empty, or any string at least 1 character long containing alphabetic characters, apostrophes, hyphens, and periods."
                            }}
                        />
                    },
                    {
                        title: "suffix",
                        idSuffix: "-suffix-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-suffix-text-field"} text="Suffix" />}
                            key={idPrefix + "-suffix-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-\.]*$/}
                                placeholderText="Suffix"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-suffix"}
                            />}
                            createInfo={{
                                title: "SUFFIX",
                                description: "The suffix field should contain any special suffixes included in the name of the swimmer being created.",
                                common_values: "\"Jr.,\" \"Sr.,\" \"III.\"",
                                permitted_values: "Empty, or any string at least 1 character long containing alphabetic characters, apostrophes, hyphens, and periods."
                            }}
                        />
                    },
                    {
                        title: "age",
                        idSuffix: "-age-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-age-text-field"} text="Age" />}
                            key={idPrefix + "-age-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                placeholderText="Age"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-age"}
                            />}
                            createInfo={{
                                title: "AGE",
                                description: "The age field should contain the age of the swimmer being created.",
                                permitted_values: "Any positive integer."
                            }}
                        />,
                        validator: (age: string) => {
                            try {
                                const age_INT = parseInt(age);
                                if (age_INT > 0) {
                                    return true;
                                } else {
                                    return {
                                        title: "AGE FIELD ERROR",
                                        description: "The swimmer age field was given an invalid value. Swimmer ages are required and must be positive integers.",
                                        fields: "Age",
                                        recommendation: "Alter the entered age to conform to the requirements of the field."
                                    }
                                }
                            } catch {
                                return {
                                    title: "AGE FIELD ERROR",
                                    description: "The swimmer age field was given an invalid value. Swimmer ages are required and must be positive integers.",
                                    fields: "Age",
                                    recommendation: "Alter the entered age to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                    {
                        title: "gender",
                        idSuffix: "-gender-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-gender-text-field"} text="Gender" />}
                            key={idPrefix + "-gender-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Gender"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-gender"}
                            />}
                            createInfo={{
                                title: "GENDER",
                                description: "The gender field should contain the gender of the swimmer being created.",
                                permitted_values: "Any string at least 1 character long containing alphabetic characters, apostrophes, and hyphens."
                            }}
                        />,
                        validator: (gender: string) => {
                            if (gender.length > 0) {
                                return true;
                            } else {
                                return {
                                    title: "GENDER FIELD ERROR",
                                    description: "The swimmer gender field was left blank. Swimmer genders are required and must be at least 1 character in length.",
                                    fields: "Gender",
                                    recommendation: "Alter the entered gender to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                ]}
                modelSelectFields={[
                    {
                        queryParamTitle: "team_id",
                        baseInfo: {
                            title: "TEAM",
                            description: "The team field should contain the name of the team the swimmer being created is associated with.",
                            permitted_values: "Any string."
                        },
                        label: <InputLabel inputId={idPrefix + "-team-model-select-field"} text="Team" />,
                        optional: false,
                        placeholderText: "Team",
                        defaultSelection: {
                            text: "",
                            model_id: -1
                        },
                        modelInfo: {
                            modelName: "TEAM",
                            specific_to: "meet",
                            apiRoute: "/api/v1/teams/",
                            id_params: {
                                meet_id: meet_id_INT
                            }
                        }
                    }
                ]}
                destructiveKeepNewInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Replacing previously-created duplicate swimmers with this one will result in the deletion of the original swimmers. Are you sure you want to continue?",
                    impact: "Swimmers with the same name and acronym as this one will be deleted.",
                    type: "duplicate_keep_new"
                }}
                // destructiveSubmitInfo={{
                //     title: "POTENTIALLY DESTRUCTIVE ACTION",
                //     description: "TEST",
                //     impact: "TEST.",
                //     type: "destructive_submission"
                // }}
                duplicateInfo={{
                    title: "UNHANDLED DUPLICATE SWIMMERS EXIST",
                    description: "One or more swimmers with the same name and acronym exist in your account. How would you like to resolve the duplicate data conflict?",
                    keep_both: true,
                    keep_new: true,
                }}
                rawDataInit={{
                    first_name: "",
                    last_name: "",
                    middle_initials: "",
                    prefix: "",
                    suffix: "",
                    age: -1,
                    gender: ""
                }}
                apiRoute="/api/v1/swimmers/"
                modelPageRoute={`meets/${meet_id_INT}/swimmers`}
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into an account before creating a swimmer for this meet.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the host account for this meet. Log into the host account before creating a swimmer for this meet.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "no team_id query parameter passed",
                        error: {
                            title: "TEAM FIELD ERROR",
                            description: "No team matching the team name provided in the team field exists. Every swimmer must be associated with a team.",
                            recommendation: "Choose an existing team for the swimmer to be associated with. If no teams exist, first add a team to the meet."
                        }
                    },
                    {
                        matchString: "no Team with the given id exists",
                        error: {
                            title: "TEAM FIELD ERROR",
                            description: "No team matching the team name provided in the team field exists. Every swimmer must be associated with a team.",
                            recommendation: "Choose an existing team for the swimmer to be associated with. If no teams exist, first add a team to the meet."
                        }
                    }
                ]}
                idPrefix={idPrefix}
                queryParams={{
                    meet_id: meet_id_INT
                }}
                submitText="Create swimmer"
            />
        </>
    )
}