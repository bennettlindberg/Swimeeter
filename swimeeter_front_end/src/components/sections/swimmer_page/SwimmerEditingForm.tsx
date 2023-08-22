import { useContext, useId } from "react";

import { SwimmerContext } from "../../pages/swimmers/SwimmerPage.tsx";
import { Swimmer } from "../../utilities/helpers/modelTypes.ts";

import { EditingForm } from "../../utilities/forms/EditingForm.tsx";
import { EditingFormGroup } from "../../utilities/forms/EditingFormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";
import { SearchSelect } from "../../utilities/inputs/SearchSelect.tsx";

// ~ component
export function SwimmerEditingForm() {
    // * initialize context, state, and id
    const { swimmerData, setSwimmerData, isMeetHost }: {
        swimmerData: Swimmer,
        setSwimmerData: React.Dispatch<React.SetStateAction<Swimmer>>,
        isMeetHost: boolean
    } = useContext(SwimmerContext);
    const idPrefix = useId();

    return (
        <>
            <EditingForm
                modelData={swimmerData}
                setModelData={setSwimmerData}
                isMeetHost={isMeetHost}
                formInputFields={[
                    {
                        title: "first_name",
                        idSuffix: "-first_name-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-first_name-text-field"} text="First name" />}
                            key={idPrefix + "-first_name-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-]*$/}
                                placeholderText="First name"
                                defaultText={swimmerData.fields.first_name}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-first_name"}
                            />}
                            editInfo={{
                                title: "FIRST NAME",
                                description: "The first name field should contain the swimmer's given name.",
                                permitted_values: "Any string at least 1 character long containing alphabetic characters, apostrophes, and hyphens."
                            }}
                            viewInfo={{
                                title: "FIRST NAME",
                                description: "The first name field contains the swimmer's given name.",
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
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-last_name-text-field"} text="Last name" />}
                            key={idPrefix + "-last_name-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-]*$/}
                                placeholderText="Last name"
                                defaultText={swimmerData.fields.last_name}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-last_name"}
                            />}
                            editInfo={{
                                title: "LAST NAME",
                                description: "The last name field should contain the swimmer's family name.",
                                permitted_values: "Any string at least 1 character long containing alphabetic characters, apostrophes, and hyphens."
                            }}
                            viewInfo={{
                                title: "LAST NAME",
                                description: "The last name field contains the swimmer's family name.",
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
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-middle_initials-text-field"} text="Middle initials" />}
                            key={idPrefix + "-middle_initials-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^([A-Z] )*$|^([A-Z] )*[A-Z]?$/}
                                placeholderText="None"
                                defaultText={swimmerData.fields.middle_initials}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-middle_initials"}
                            />}
                            editInfo={{
                                title: "MIDDLE INITIALS",
                                description: "The middle initials field should contain a space-separated list of the swimmer's uppercase middle initials.",
                                permitted_values: "Empty, or any string at least 1 character long containing space-separated uppercase alphabetic characters."
                            }}
                            viewInfo={{
                                title: "MIDDLE INITIALS",
                                description: "The middle initials field contains a space-separated list of the swimmer's uppercase middle initials.",
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
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-prefix-text-field"} text="Prefix" />}
                            key={idPrefix + "-prefix-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-\.]*$/}
                                placeholderText="None"
                                defaultText={swimmerData.fields.prefix}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-prefix"}
                            />}
                            editInfo={{
                                title: "PREFIX",
                                description: "The prefix field should contain any special prefixes included in the swimmer's name.",
                                common_values: "\"St.,\" \"Sir.\" This field is not intended for \"Mr.,\" \"Mrs.,\" and \"Ms.\" prefixes.",
                                permitted_values: "Empty, or any string at least 1 character long containing alphabetic characters, apostrophes, hyphens, and periods."
                            }}
                            viewInfo={{
                                title: "PREFIX",
                                description: "The prefix field contains any special prefixes included in the swimmer's name.",
                            }}
                        />
                    },
                    {
                        title: "suffix",
                        idSuffix: "-suffix-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-suffix-text-field"} text="Suffix" />}
                            key={idPrefix + "-suffix-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^[A-Za-z\'\-\.]*$/}
                                placeholderText="None"
                                defaultText={swimmerData.fields.suffix}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-suffix"}
                            />}
                            editInfo={{
                                title: "SUFFIX",
                                description: "The suffix field should contain any special suffixes included in the swimmer's name.",
                                common_values: "\"Jr.,\" \"Sr.,\" \"III.\"",
                                permitted_values: "Empty, or any string at least 1 character long containing alphabetic characters, apostrophes, hyphens, and periods."
                            }}
                            viewInfo={{
                                title: "SUFFIX",
                                description: "The suffix field contains any special suffixes included in the swimmer's name.",
                            }}
                        />
                    },
                    {
                        title: "age",
                        idSuffix: "-age-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-age-text-field"} text="Age" />}
                            key={idPrefix + "-age-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                placeholderText="Age"
                                defaultText={`${swimmerData.fields.age}`}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-age"}
                            />}
                            editInfo={{
                                title: "AGE",
                                description: "The age field should contain the swimmer's age.",
                                permitted_values: "Any positive integer."
                            }}
                            viewInfo={{
                                title: "AGE",
                                description: "The first name field contains the swimmer's age.",
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
                        idSuffix: "-gender-select-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-gender-select-field"} text="Gender" />}
                            key={idPrefix + "-gender-select-field"}
                            optional={false}
                            field={<SearchSelect
                                regex={/^.*$/}
                                otherEnabled={true}
                                placeholderText="Gender"
                                defaultText={swimmerData.fields.gender}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-gender"}
                                options={["Man", "Woman"]}
                            />}
                            editInfo={{
                                title: "GENDER",
                                description: "The gender field should contain the gender of the swimmer.",
                                common_values: "Man, Woman",
                                permitted_values: "Any string. Although the most common values are provided as select options, you may provide any gender string.",
                                warning: "\"Mixed\" events allow for swimmers of any gender to compete. Both \"Men\" and \"Boys\" events allow for competitors with the genders \"Man\" and \"Boy\". Both \"Women\" and \"Girls\" events allow for competitors with the genders \"Woman\" and \"Girl\"."
                            }}
                            viewInfo={{
                                title: "GENDER",
                                description: "The gender field contains the gender of the swimmer.",
                            }}
                        />,
                        validator: (gender: string) => {
                            if (gender === "") {
                                return {
                                    title: "GENDER FIELD ERROR",
                                    description: "The gender field was left blank. Swimmer genders are required and can be any string.",
                                    fields: "Gender",
                                    recommendation: "Alter the entered swimmer gender to conform to the requirements of the field."
                                }
                            } else {
                                return true;
                            }
                        }
                    }
                ]}
                modelSelectFields={swimmerData.pk !== -1
                    ? [
                        {
                            queryParamTitle: "team_id",
                            idSuffix: "-team-model-select-field",
                            baseInfo: {
                                title: "TEAM",
                                description: "The team field should contain the name of the team the swimmer is associated with.",
                                permitted_values: "Any string."
                            },
                            viewInfo: {
                                title: "TEAM",
                                description: "The team field contains the name of the team the swimmer is associated with.",
                            },
                            label: <InputLabel inputId={idPrefix + "-team-model-select-field"} text="Team" />,
                            optional: false,
                            placeholderText: "Team",
                            defaultSelection: {
                                text: swimmerData.fields.team.fields.name,
                                model_id: swimmerData.fields.team.pk
                            },
                            modelInfo: {
                                modelName: "TEAM",
                                specific_to: "meet",
                                apiRoute: "/api/v1/teams/",
                                id_params: {
                                    meet_id: swimmerData.fields.meet.pk
                                }
                            }
                        }
                    ]
                    : []}
                destructiveKeepNewInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Replacing previously-created duplicate swimmers with this one will result in the deletion of the original swimmers. Are you sure you want to continue?",
                    impact: "Swimmers with the same name, age, gender, and team as this one will be deleted.",
                    type: "duplicate_keep_new"
                }}
                destructiveSubmitInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Modifying the values of certain fields of this swimmer may cause the invalidation and deletion of the swimmer's entries and those entries' events' seeding. Are you sure you want to continue?",
                    impact: "Entries for which the modified participant is ineligible to compete in the entry's event will be deleted. For each deleted entry, the entry's event's seeding (if any) will be deleted as well.",
                    type: "destructive_submission"
                }}
                duplicateInfo={{
                    title: "UNHANDLED DUPLICATE SWIMMERS EXIST",
                    description: "One or more swimmers with the same name, age, gender, and team exist in your account. How would you like to resolve the duplicate data conflict?",
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
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into the host account account before modifying this swimmer.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the host account for this meet. Log into the host account before modifying this swimmer.",
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
                    swimmer_id: swimmerData.pk
                }}
                submitText="Save swimmer"
                editText="Edit swimmer"
                destructiveDeletionInfo={{
                    title: "DESTRUCTIVE DELETION",
                    description: "Deleting this swimmer will permanently delete all of the swimmer's data, including its individual and relay entries. Are you sure you want to continue?",
                    impact: "All swimmer data will be permanently deleted.",
                    type: "destructive_deletion"
                }}
                deletionErrorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the account of the meet host. Log into the host account before deleting this swimmer.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the account of the meet host. Log into the host account before deleting this swimmer.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    }
                ]}
                deletionText="Delete swimmer"
                deletionQueryParam={{
                    "swimmer_id": swimmerData.pk
                }}
                deletionForwardRoute={`/meets/${swimmerData.fields.meet.pk}`}
            />
        </>
    )
}