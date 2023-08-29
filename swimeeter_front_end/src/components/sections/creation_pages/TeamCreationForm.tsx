import { useId } from "react";

import { CreationForm } from "../../utilities/forms/CreationForm.tsx";
import { CreationFormGroup } from "../../utilities/forms/CreationFormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";

// ~ component
export function TeamCreationForm({ meet_id_INT, scrollRef }: { meet_id_INT: number, scrollRef: React.RefObject<HTMLHeadingElement> }) {
    // * initialize id
    const idPrefix = useId();

    return (
        <>
            <CreationForm
                scrollRef={scrollRef}
                formInputFields={[[
                    {
                        title: "name",
                        idSuffix: "-name-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-name-text-field"} text="Name" />}
                            key={idPrefix + "-name-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Name"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-name"}
                            />}
                            createInfo={{
                                title: "NAME",
                                description: "The name field should contain the name of the team being created.",
                                permitted_values: "Any string at least 1 character long.",
                            }}
                        />,
                        validator: (name: string) => {
                            if (name.length > 0) {
                                return true;
                            } else {
                                return {
                                    title: "NAME FIELD ERROR",
                                    description: "The team name field was left blank. Team names are required and must be at least 1 character in length.",
                                    fields: "Name",
                                    recommendation: "Alter the entered name to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                    {
                        title: "acronym",
                        idSuffix: "-acronym-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-acronym-text-field"} text="Acronym" />}
                            key={idPrefix + "-acronym-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Acronym"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-acronym"}
                            />}
                            createInfo={{
                                title: "ACRONYM",
                                description: "The acronym field should contain an acronym corresponding to the name of the team.",
                                common_values: "Team acronyms usually consist of all uppercase alphabetic letters.",
                                permitted_values: "Any string at least 1 character long.",
                            }}
                        />,
                        validator: (acronym: string) => {
                            if (acronym.length > 0) {
                                return true;
                            } else {
                                return {
                                    title: "ACRONYM FIELD ERROR",
                                    description: "The team acronym field was left blank. Team acronyms are required and must be at least 1 character in length.",
                                    fields: "Acronym",
                                    recommendation: "Alter the entered acronym to conform to the requirements of the field."
                                }
                            }
                        }
                    }
                ]]}
                modelSelectFields={[]}
                destructiveKeepNewInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Replacing previously-created duplicate teams with this one will result in the deletion of the original teams. Are you sure you want to continue?",
                    impact: "Teams with the same name and acronym as this one will be deleted.",
                    type: "duplicate_keep_new"
                }}
                // destructiveSubmitInfo={{
                //     title: "POTENTIALLY DESTRUCTIVE ACTION",
                //     description: "TEST",
                //     impact: "TEST.",
                //     type: "destructive_submission"
                // }}
                duplicateInfo={{
                    title: "UNHANDLED DUPLICATE TEAMS EXIST",
                    description: "One or more teams with the same name and acronym exist in your account. How would you like to resolve the duplicate data conflict?",
                    keep_both: true,
                    keep_new: true,
                }}
                rawDataInit={{
                    name: "",
                    acronym: "",
                }}
                apiRoute="/api/v1/teams/"
                modelPageRoute={`meets/${meet_id_INT}/teams`}
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into an account before creating a team for this meet.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the host account for this meet. Log into the host account before creating a team for this meet.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    }
                ]}
                idPrefix={idPrefix}
                queryParams={{
                    meet_id: meet_id_INT
                }}
                submitText="Create team"
            />
        </>
    )
}