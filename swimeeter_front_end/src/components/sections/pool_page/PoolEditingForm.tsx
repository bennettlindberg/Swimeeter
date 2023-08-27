import { useContext, useId } from "react";

import { PoolContext } from "../../pages/pools/PoolPage.tsx";
import { Pool } from "../../utilities/helpers/modelTypes.ts";

import { EditingForm } from "../../utilities/forms/EditingForm.tsx";
import { EditingFormGroup } from "../../utilities/forms/EditingFormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";
import { SearchSelect } from "../../utilities/inputs/SearchSelect.tsx";

// ~ component
export function PoolEditingForm({scrollRef}: {scrollRef: React.RefObject<HTMLHeadingElement>}) {
    // * initialize context, state, and id
    const { poolData, setPoolData, isMeetHost }: {
        poolData: Pool,
        setPoolData: React.Dispatch<React.SetStateAction<Pool>>,
        isMeetHost: boolean
    } = useContext(PoolContext);
    const idPrefix = useId();

    return (
        <>
            <EditingForm
                scrollRef={scrollRef}
                modelData={poolData}
                setModelData={setPoolData}
                isMeetHost={isMeetHost}
                formInputFields={[
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
                                defaultText={poolData.fields.name}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-name"}
                            />}
                            editInfo={{
                                title: "NAME",
                                description: "The name field should contain the name of the pool.",
                                permitted_values: "Any string at least 1 character long.",
                            }}
                            viewInfo={{
                                title: "NAME",
                                description: "The name field contains the name of the pool.",
                            }}
                        />,
                        validator: (name: string) => {
                            if (name.length > 0) {
                                return true;
                            } else {
                                return {
                                    title: "NAME FIELD ERROR",
                                    description: "The pool name field was left blank. Pool names are required and must be at least 1 character in length.",
                                    fields: "Name",
                                    recommendation: "Alter the entered name to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                    {
                        title: "street_address",
                        idSuffix: "-street_address-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-street_address-text-field"} text="Street address" />}
                            key={idPrefix + "-street_address-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Street address"
                                defaultText={poolData.fields.street_address}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-street_address"}
                            />}
                            editInfo={{
                                title: "STREET ADDRESS",
                                description: "The street address field should contain the street address of the pool.",
                                common_values: "Street addresses generally come in the form of the following example: \"123 Main Street.\"",
                                permitted_values: "Any string. May be left blank.",
                            }}
                            viewInfo={{
                                title: "STREET ADDRESS",
                                description: "The street address field contains the street address of the pool.",
                            }}
                        />
                    },
                    {
                        title: "city",
                        idSuffix: "-city-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-city-text-field"} text="City" />}
                            key={idPrefix + "-city-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="City"
                                defaultText={poolData.fields.city}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-city"}
                            />}
                            editInfo={{
                                title: "CITY",
                                description: "The city field should contain the city the pool is located in.",
                                permitted_values: "Any string. May be left blank.",
                            }}
                            viewInfo={{
                                title: "CITY",
                                description: "The city field contains the name of the city the pool is located in.",
                            }}
                        />
                    },
                    {
                        title: "state",
                        idSuffix: "-state-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-state-text-field"} text="State" />}
                            key={idPrefix + "-state-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="State"
                                defaultText={poolData.fields.state}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-state"}
                            />}
                            editInfo={{
                                title: "STATE",
                                description: "The state field should contain the state the pool is located in.",
                                permitted_values: "Any string. May be left blank.",
                            }}
                            viewInfo={{
                                title: "STATE",
                                description: "The state field contains the name of the state the pool is located in.",
                            }}
                        />
                    },
                    {
                        title: "country",
                        idSuffix: "-country-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-country-text-field"} text="Country" />}
                            key={idPrefix + "-country-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Country"
                                defaultText={poolData.fields.country}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-country"}
                            />}
                            editInfo={{
                                title: "COUNTRY",
                                description: "The country field should contain the country the pool is located in.",
                                permitted_values: "Any string. May be left blank.",
                            }}
                            viewInfo={{
                                title: "COUNTRY",
                                description: "The country field contains the name of the country the pool is located in.",
                            }}
                        />
                    },
                    {
                        title: "zipcode",
                        idSuffix: "-zipcode-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-zipcode-text-field"} text="Zip code" />}
                            key={idPrefix + "-zipcode-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^[0-9]*$/}
                                placeholderText="Zip code"
                                defaultText={poolData.fields.zipcode}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-zipcode"}
                            />}
                            editInfo={{
                                title: "ZIP CODE",
                                description: "The zip code field should contain the zip code of location of the pool.",
                                permitted_values: "Any numerical string. May be left blank.",
                            }}
                            viewInfo={{
                                title: "ZIP CODE",
                                description: "The zip code field contains the zip code of location of the pool.",
                            }}
                        />
                    },
                    {
                        title: "lanes",
                        idSuffix: "-lanes-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-lanes-text-field"} text="Number of lanes" />}
                            key={idPrefix + "-lanes-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^[0-9]*$/}
                                placeholderText="Number of lanes"
                                defaultText={`${poolData.fields.lanes}`}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-lanes"}
                            />}
                            editInfo={{
                                title: "NUMBER OF LANES",
                                description: "The number of lanes field should contain the number of lanes being used for competition in the pool.",
                                permitted_values: "Any positive integer greater than or equal to 3.",
                            }}
                            viewInfo={{
                                title: "NUMBER OF LANES",
                                description: "The number of lanes field contains the number of lanes being used for competition in the pool.",
                            }}
                        />,
                        validator: (lanes: string) => {
                            try {
                                const lanes_INT = parseInt(lanes);

                                if (lanes_INT > 3) {
                                    return true;
                                } else {
                                    return {
                                        title: "NUMBER OF LANES FIELD ERROR",
                                        description: "The pool number of lanes field was provided an invalid value. Pool number of lanes values are required and must be positive integers greater than or equal to 3.",
                                        fields: "Number of lanes",
                                        recommendation: "Alter the entered number of lanes to conform to the requirements of the field."
                                    }
                                }
                            } catch {
                                return {
                                    title: "NUMBER OF LANES FIELD ERROR",
                                    description: "The pool number of lanes field was provided an invalid value. Pool number of lanes values are required and must be positive integers greater than or equal to 3.",
                                    fields: "Number of lanes",
                                    recommendation: "Alter the entered number of lanes to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                    {
                        title: "side_length",
                        idSuffix: "-side_length-select-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-side_length-select-field"} text="Side length" />}
                            key={idPrefix + "-side_length-select-field"}
                            optional={false}
                            field={<SearchSelect
                                regex={/^[0-9]*$/}
                                otherEnabled={true}
                                placeholderText="Side length"
                                defaultText={`${poolData.fields.side_length}`}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-side_length"}
                                options={["25", "50"]}
                            />}
                            editInfo={{
                                title: "SIDE LENGTH",
                                description: "The side length field should contain the competition length of the pool.",
                                common_values: "25, 50",
                                permitted_values: "Although the most common side lengths are provided as select options, any positive integer may be chosen.",
                            }}
                            viewInfo={{
                                title: "SIDE LENGTH",
                                description: "The side length field contains the competition length of the pool.",
                            }}
                        />,
                        validator: (length: string) => {
                            try {
                                const length_INT = parseInt(length);

                                if (length_INT > 0) {
                                    return true;
                                } else {
                                    return {
                                        title: "SIDE LENGTH FIELD ERROR",
                                        description: "The pool side length field was provided an invalid value. Pool side length values are required and must be positive integers.",
                                        fields: "Side length",
                                        recommendation: "Alter the entered side length to conform to the requirements of the field."
                                    }
                                }
                            } catch {
                                return {
                                    title: "SIDE LENGTH FIELD ERROR",
                                    description: "The pool side length field was provided an invalid value. Pool side length values are required and must be positive integers.",
                                    fields: "Side length",
                                    recommendation: "Alter the entered side length to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                    {
                        title: "measure_unit",
                        idSuffix: "-measure_unit-select-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <EditingFormGroup
                            label={<InputLabel inputId={idPrefix + "-measure_unit-select-field"} text="Measure unit" />}
                            key={idPrefix + "-measure_unit-select-field"}
                            optional={false}
                            field={<SearchSelect
                                regex={/^.*$/}
                                otherEnabled={true}
                                placeholderText="Measure unit"
                                defaultText={poolData.fields.measure_unit}
                                pixelWidth={300}
                                idPrefix={idPrefix + "-measure_unit"}
                                options={["Yard", "Meter"]}
                            />}
                            editInfo={{
                                title: "MEASURE UNIT",
                                description: "The measure unit field should contain the units used to measure the side length of the pool.",
                                common_values: "\"Yard,\" \"Meter.\" Pool measure units are usually capitalized and singular.",
                                permitted_values: "Although the most common measure units are provided as select options, any string may be chosen."
                            }}
                            viewInfo={{
                                title: "MEASURE UNIT",
                                description: "The measure unit field contains the units used to measure the side length of the pool.",
                            }}
                        />,
                        validator: (measure_unit: string) => {
                            if (measure_unit.length > 0) {
                                return true;
                            } else {
                                return {
                                    title: "MEASURE UNIT FIELD ERROR",
                                    description: "The pool measure unit field was left blank. Pool measure units are required and must be at least 1 character in length.",
                                    fields: "Measure unit",
                                    recommendation: "Alter the entered measure unit to conform to the requirements of the field."
                                }
                            }
                        }
                    },
                ]}
                modelSelectFields={[]}
                destructiveKeepNewInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Replacing previously-created duplicate pools with this one will result in the deletion of the original pools. Are you sure you want to continue?",
                    impact: "Pools with the same name, number of lanes, side length, and measure unit as this one will be deleted.",
                    type: "duplicate_keep_new"
                }}
                // destructiveSubmitInfo={{
                //     title: "POTENTIALLY DESTRUCTIVE ACTION",
                //     description: "TEST",
                //     impact: "TEST.",
                //     type: "destructive_submission"
                // }}
                duplicateInfo={{
                    title: "UNHANDLED DUPLICATE POOLS EXIST",
                    description: "One or more pools with the same name, number of lanes, side length, and measure unit exist in your account. How would you like to resolve the duplicate data conflict?",
                    keep_both: true,
                    keep_new: true,
                }}
                rawDataInit={{
                    name: "",
                    lanes: 0,
                    side_length: 0,
                    measure_unit: ""
                }}
                apiRoute="/api/v1/pools/"
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into an account before modifying this pool.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the host account for this meet. Log into the host account before modifying this pool.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    }
                ]}
                idPrefix={idPrefix}
                queryParams={{
                    pool_id: poolData.pk
                }}
                submitText="Save pool"
                editText="Edit pool"
                destructiveDeletionInfo={{
                    title: "DESTRUCTIVE DELETION",
                    description: "Deleting this pool will permanently delete all of the pool's data, including its sessions, events, and entries. Are you sure you want to continue?",
                    impact: "All pool data will be permanently deleted.",
                    type: "destructive_deletion"
                }}
                deletionErrorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the account of the meet host. Log into the host account before deleting this pool.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the account of the meet host. Log into the host account before deleting this pool.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    }
                ]}
                deletionText="Delete pool"
                deletionQueryParam={{
                    "pool_id": poolData.pk
                }}
                deletionForwardRoute={`/meets/${poolData.fields.meet.pk}`}
            />
        </>
    )
}