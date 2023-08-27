import { useContext, useId } from "react";

import { AppContext, UserState } from "../../../App.tsx";
import { convertRawData } from "../../utilities/helpers/formHelpers.ts";
import { generateUserProfileName } from "../../utilities/helpers/nameGenerators.ts";

import { CreationForm } from "../../utilities/forms/CreationForm.tsx";
import { CreationFormGroup } from "../../utilities/forms/CreationFormGroup.tsx";
import { NeutralFormGroup } from "../../utilities/forms/NeutralFormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";
import { SearchSelect } from "../../utilities/inputs/SearchSelect.tsx";

// ~ component
export function MeetCreationForm({scrollRef}: {scrollRef: React.RefObject<HTMLHeadingElement>}) {
    // * initialize context, state, and id
    const { userState }: { userState: UserState } = useContext(AppContext);
    const idPrefix = useId();

    return (
        <>
            <CreationForm
                scrollRef={scrollRef}
                formInputFields={[
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
                                description: "The name field should contain the name of the meet being created.",
                                permitted_values: "Any string at least 1 character long.",
                            }}
                        />,
                        validator: (name: string) => {
                            if (name.length > 0) {
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
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-visibility-select-field"} text="Visibility" />}
                            key={idPrefix + "-visibility-select-field"}
                            optional={false}
                            field={<SearchSelect
                                regex={/^(P(u(b(l(i(c?)?)?)?)?)?)?$|^(P(r(i(v(a(t(e?)?)?)?)?)?)?)?$/}
                                otherEnabled={false}
                                placeholderText="Visibility"
                                defaultText="Public"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-visibility"}
                                options={["Public", "Private"]}
                            />}
                            createInfo={{
                                title: "VISIBILITY",
                                description: "The value of the visibility field determines who can view the meet being created. Private meets can only be seen by the meet host.",
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
                        formGroup: <NeutralFormGroup
                            label={<InputLabel inputId={idPrefix + "-host-text-field"} text="Host" />}
                            key={idPrefix + "-host-text-field"}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Host name"
                                defaultText={userState.profile ? generateUserProfileName(userState.profile) : ""}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-host"}
                            />}
                            baseInfo={{
                                title: "HOST",
                                description: "The host field contains the name of the account that created and owns the meet. The value of this field is read-only as it must contain the currently logged-in user.",
                            }}
                        />,
                    },
                    {
                        title: "begin_time",
                        idSuffix: "-begin_time-text-field",
                        readOnly: true,
                        duplicateSensitive: false,
                        formGroup: <NeutralFormGroup
                            label={<InputLabel inputId={idPrefix + "-begin_time-text-field"} text="Begin time" />}
                            key={idPrefix + "-begin_time-text-field"}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="N/A"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-begin_time"}
                            />}
                            baseInfo={{
                                title: "BEGIN TIME",
                                description: "The begin time field contains the overall beginning time of the meet in your local timezone. The value of this field is read-only as it is determined automatically by the beginning times of the meet's sessions.",
                            }}
                        />,
                    },
                    {
                        title: "end_time",
                        idSuffix: "-end_time-text-field",
                        readOnly: true,
                        duplicateSensitive: false,
                        formGroup: <NeutralFormGroup
                            label={<InputLabel inputId={idPrefix + "-end_time-text-field"} text="End time" />}
                            key={idPrefix + "-end_time-text-field"}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="N/A"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-end_time"}
                            />}
                            baseInfo={{
                                title: "END TIME",
                                description: "The end time field contains the overall ending time of the meet in your local timezone. The value of this field is read-only as it is determined automatically by the ending times of the meet's sessions.",
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
                modelPageRoute="meets"
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into an account before creating a meet.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    }
                ]}
                idPrefix={idPrefix}
                queryParams={{}}
                submitText="Create meet"
            />
        </>
    )
}