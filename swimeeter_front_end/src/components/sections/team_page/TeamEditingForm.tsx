import { useContext, useId } from "react";

import { TeamContext } from "../../pages/teams/TeamPage.tsx";
import { Team } from "../../utilities/helpers/modelTypes.ts";

import { EditingForm } from "../../utilities/forms/EditingForm.tsx";
import { EditingFormGroup } from "../../utilities/forms/EditingFormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";

// ~ component
export function TeamEditingForm({scrollRef}: {scrollRef: React.RefObject<HTMLHeadingElement>}) {
    // * initialize context, state, and id
    const { teamData, setTeamData, isMeetHost }: {
        teamData: Team,
        setTeamData: React.Dispatch<React.SetStateAction<Team>>,
        isMeetHost: boolean
    } = useContext(TeamContext);
    const idPrefix = useId();

    return (
        <>
            <EditingForm
                scrollRef={scrollRef}
                modelData={teamData}
                setModelData={setTeamData}
                isMeetHost={isMeetHost}
                formInputFields={[[
                    {
                        title: "name",
                        idSuffix: "-name-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-name-text-field"} text="Name" />}
                            key={idPrefix + "-name-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Name"
                                defaultText={teamData.fields.name}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-name"}
                            />}
                            editInfo={{
                                title: "NAME",
                                description: "The name field should contain the name of the team.",
                                permitted_values: "Any string at least 1 character long.",
                            }}
                            viewInfo={{
                                title: "NAME",
                                description: "The name field contains the name of the team.",
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
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-acronym-text-field"} text="Acronym" />}
                            key={idPrefix + "-acronym-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Acronym"
                                defaultText={teamData.fields.acronym}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-acronym"}
                            />}
                            editInfo={{
                                title: "ACRONYM",
                                description: "The acronym field should contain an acronym corresponding to the name of the team.",
                                permitted_values: "Any string at least 1 character long.",
                            }}
                            viewInfo={{
                                title: "ACRONYM",
                                description: "The acronym field contains an acronym corresponding to the name of the team.",
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
                    },
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
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into an account before modifying this team.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the host account for this meet. Log into the host account before modifying this team.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    }
                ]}
                idPrefix={idPrefix}
                queryParams={{
                    team_id: teamData.pk
                }}
                submitText="Save team"
                editText="Edit team"
                destructiveDeletionInfo={{
                    title: "DESTRUCTIVE DELETION",
                    description: "Deleting this team will permanently delete all of the team's data, including its swimmers and entries. Are you sure you want to continue?",
                    impact: "All team data will be permanently deleted.",
                    type: "destructive_deletion"
                }}
                deletionErrorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the account of the meet host. Log into the host account before deleting this team.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the account of the meet host. Log into the host account before deleting this team.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    }
                ]}
                deletionText="Delete team"
                deletionQueryParam={{
                    "team_id": teamData.pk
                }}
                deletionForwardRoute={`/meets/${teamData.fields.meet.pk}`}
            />
        </>
    )
}