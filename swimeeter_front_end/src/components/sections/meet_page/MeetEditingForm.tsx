import { useContext, useId } from "react";

import { MeetContext } from "../../pages/meets/MeetPage.tsx";
import { Meet } from "../../utilities/models/modelTypes.ts";
import { convertRawData } from "../../utilities/forms/formHelpers.ts";
import { generateHostName } from "../../utilities/models/nameGenerators.ts";

import { EditingForm } from "../../utilities/forms/EditingForm.tsx";
import { FormGroup } from "../../utilities/forms/FormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";
import { SearchSelect } from "../../utilities/inputs/SearchSelect.tsx";

// ~ component
export function MeetEditingForm() {
    // * initialize context, state, and id
    const { meetData, setMeetData, isMeetHost }: {
        meetData: Meet,
        setMeetData: React.Dispatch<React.SetStateAction<Meet>>,
        isMeetHost: boolean
    } = useContext(MeetContext);
    const idPrefix = useId();

    return (
        <>
            <EditingForm
                modelData={meetData}
                setModelData={setMeetData}
                isMeetHost={isMeetHost}
                formInputFields={[
                    {
                        title: "name",
                        idSuffix: "-name-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <FormGroup
                            label={<InputLabel inputId={idPrefix + "-name-text-field"} text="Name" />}
                            key={idPrefix + "-name-text-field"}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Name"
                                defaultText={meetData.fields.name}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-name"}
                            />}
                            info={{
                                title: "NAME",
                                description: "The name field should contain the name of the meet being modified.",
                                permitted_values: "Any string at least 1 character long.",
                            }}
                        />,
                        validator: (name: string) => {
                            if (name.length > 1) {
                                return true;
                            } else {
                                return {
                                    title: "NAME FIELD ERROR",
                                    description: "The meet name field was left blank. Meet names are required and must be at least 1 character in length.",
                                    fields: "Name",
                                    recommendation: "Alter the entered name to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                    {
                        title: "is_public",
                        idSuffix: "-visibility-select-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <FormGroup
                            label={<InputLabel inputId={idPrefix + "-visibility-select-field"} text="Visibility" />}
                            key={idPrefix + "-visibility-select-field"}
                            field={<SearchSelect
                                regex={/^(P(u(b(l(i(c?)?)?)?)?)?)?$|^(P(r(i(v(a(t(e?)?)?)?)?)?)?)?$/}
                                otherEnabled={false}
                                placeholderText="Visibility"
                                defaultText={meetData.fields.is_public ? "Public" : "Private"}
                                pixelWidth={100}
                                idPrefix={idPrefix + "-visibility"}
                                options={["Public", "Private"]}
                            />}
                            info={{
                                title: "VISIBILITY",
                                description: "The value of the visibility field determines who can view the meet being modified. Private meets can only be seen by the meet host.",
                                permitted_values: "Public, Private"
                            }}
                        />,
                        validator: (visibility: string) => {
                            if (visibility === "Public" || visibility === "Private") {
                                return true;
                            } else {
                                return {
                                    title: "VISIBILITY FIELD ERROR",
                                    description: "An unexpected value was entered for the visibility field.",
                                    fields: "Visibility",
                                    recommendation: "Choose \"Public\" or \"Private\" as the entered value for the visibility field."
                                }
                            }
                        },
                        converter: (visibility: string) => {
                            const convertedVisibility = convertRawData<string, boolean>(visibility, [
                                { raw: "Public", formatted: true },
                                { raw: "Private", formatted: false }
                            ])
                            if (convertedVisibility === undefined) {
                                return true;
                            } else {
                                return convertedVisibility;
                            }
                        }
                    },
                    {
                        title: "host",
                        idSuffix: "-host-text-field",
                        readOnly: true,
                        duplicateSensitive: false,
                        formGroup: <FormGroup
                            label={<InputLabel inputId={idPrefix + "-host-text-field"} text="Host" />}
                            key={idPrefix + "-host-text-field"}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Host name"
                                defaultText={generateHostName(meetData.fields.host)}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-host"}
                            />}
                            info={{
                                title: "HOST",
                                description: "The host field contains the name of the account that created and owns the meet being viewed. The value of this field is read-only as it cannot be changed after meet creation.",
                                permitted_values: "Any string at least 1 character long.",
                            }}
                        />,
                    },
                    {
                        title: "begin_time",
                        idSuffix: "-begin_time-text-field",
                        readOnly: true,
                        duplicateSensitive: false,
                        formGroup: <FormGroup
                            label={<InputLabel inputId={idPrefix + "-begin_time-text-field"} text="Begin time" />}
                            key={idPrefix + "-begin_time-text-field"}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Begin time"
                                defaultText={meetData.fields.begin_time ? meetData.fields.begin_time.toLocaleTimeString() : "N/A"}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-begin_time"}
                            />}
                            info={{
                                title: "BEGIN TIME",
                                description: "The begin time field contains the overall beginning time of the meet. The value of this field is read-only as it is determined automatically by the beginning times of the meet's sessions.",
                                permitted_values: "Any valid date and time.",
                            }}
                        />,
                    },
                    {
                        title: "end_time",
                        idSuffix: "-end_time-text-field",
                        readOnly: true,
                        duplicateSensitive: false,
                        formGroup: <FormGroup
                            label={<InputLabel inputId={idPrefix + "-end_time-text-field"} text="End time" />}
                            key={idPrefix + "-end_time-text-field"}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="End time"
                                defaultText={meetData.fields.end_time ? meetData.fields.end_time.toLocaleTimeString() : "N/A"}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-end_time"}
                            />}
                            info={{
                                title: "END TIME",
                                description: "The end time field contains the overall ending time of the meet. The value of this field is read-only as it is determined automatically by the ending times of the meet's sessions.",
                                permitted_values: "Any valid date and time.",
                            }}
                        />,
                    }
                ]}
                modelSelectFields={[]}
                destructiveKeepNewInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Replacing previously-created duplicate meets with this one will result in the deletion of the original meets. Are you sure you want to continue?",
                    impact: "Meets with the same name as this one will be deleted.",
                    type: "duplicate_keep_new"
                }}
                // destructiveSubmitInfo={{
                //     title: "POTENTIALLY DESTRUCTIVE ACTION",
                //     description: "TEST",
                //     impact: "TEST.",
                //     type: "destructive_submission"
                // }}
                duplicateInfo={{
                    title: "UNHANDLED DUPLICATE MEETS EXIST",
                    description: "One or more meets with the same name exist in your account. How would you like to resolve the duplicate data conflict?",
                    keep_both: true,
                    keep_new: true,
                }}
                rawDataInit={{
                    name: "",
                    is_public: "Public"
                }}
                apiRoute="/api/v1/meets/"
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into an account before modifying this meet.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    }
                ]}
                idPrefix={idPrefix}
                queryParams={{
                    meet_id: meetData.pk
                }}
                submitText="Save meet"
                editText="Edit meet"
                destructiveDeletionInfo={{
                    title: "DESTRUCTIVE DELETION",
                    description: "Deleting this meet will permanently delete all of the meet's data, including its pools, sessions, events, teams, swimmers, and entries. Are you sure you want to continue?",
                    impact: "All meet data will be permanently deleted.",
                    type: "destructive_deletion"
                }}
                deletionErrorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the account of the meet host. Log into the host account before deleting this meet.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the account of the meet host. Log into the host account before deleting this meet.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    }
                ]}
                deletionText="Delete meet"
                deletionQueryParam={{
                    "meet_id": meetData.pk
                }}
                deletionForwardRoute="/meets"
            />
        </>
    )
}