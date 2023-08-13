import { useId } from "react";

import { CreationForm } from "../../utilities/forms/CreationForm.tsx";
import { CreationFormGroup } from "../../utilities/forms/CreationFormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";

// ~ component
export function PoolCreationForm({ meet_id_INT }: {meet_id_INT: number}) {
    // * initialize id
    const idPrefix = useId();

    return (
        <>
            <CreationForm
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
                                description: "The name field should contain the name of the pool being created.",
                                permitted_values: "Any string at least 1 character long.",
                            }}
                        />,
                        validator: (name: string) => {
                            if (name.length > 1) {
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
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-street_address-text-field"} text="Street address" />}
                            key={idPrefix + "-street_address-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Street address"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-street_address"}
                            />}
                            createInfo={{
                                title: "STREET ADDRESS",
                                description: "The street address field should contain the street address of the pool being created.",
                                common_values: "\"Street addresses generally come in the form of the following example: \"123 Main Street.\"",
                                permitted_values: "Any string. May be left blank.",
                            }}
                        />
                    },
                    {
                        title: "city",
                        idSuffix: "-city-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-city-text-field"} text="City" />}
                            key={idPrefix + "-city-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="City"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-city"}
                            />}
                            createInfo={{
                                title: "CITY",
                                description: "The city field should contain the city the pool being created is located in.",
                                permitted_values: "Any string. May be left blank.",
                            }}
                        />
                    },
                    {
                        title: "state",
                        idSuffix: "-state-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-state-text-field"} text="State" />}
                            key={idPrefix + "-state-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="State"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-state"}
                            />}
                            createInfo={{
                                title: "STATE",
                                description: "The state field should contain the state the pool being created is located in.",
                                permitted_values: "Any string. May be left blank.",
                            }}
                        />
                    },
                    {
                        title: "country",
                        idSuffix: "-country-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-country-text-field"} text="Country" />}
                            key={idPrefix + "-country-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Country"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-country"}
                            />}
                            createInfo={{
                                title: "COUNTRY",
                                description: "The country field should contain the country the pool being created is located in.",
                                permitted_values: "Any string. May be left blank.",
                            }}
                        />
                    },
                    {
                        title: "zipcode",
                        idSuffix: "-zipcode-text-field",
                        readOnly: false,
                        duplicateSensitive: false,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-zipcode-text-field"} text="Zip code" />}
                            key={idPrefix + "-zipcode-text-field"}
                            optional={true}
                            field={<TextInput
                                regex={/^[0-9]*$/}
                                placeholderText="Zip code"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-zipcode"}
                            />}
                            createInfo={{
                                title: "ZIP CODE",
                                description: "The zip code field should contain the zip code of location of the created pool.",
                                permitted_values: "Any numerical string. May be left blank.",
                            }}
                        />
                    },
                    {
                        title: "lanes",
                        idSuffix: "-lanes-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-lanes-text-field"} text="Number of lanes" />}
                            key={idPrefix + "-lanes-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^[0-9]*$/}
                                placeholderText="Number of lanes"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-lanes"}
                            />}
                            createInfo={{
                                title: "NUMBER OF LANES",
                                description: "The number of lanes field should contain the number of lanes being used for competition in the pool being created.",
                                permitted_values: "Any positive integer greater than or equal to 3.",
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
                        idSuffix: "-side_length-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-side_length-text-field"} text="Side length" />}
                            key={idPrefix + "-side_length-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^[0-9]*$/}
                                placeholderText="Side length"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-side_length"}
                            />}
                            createInfo={{
                                title: "SIDE LENGTH",
                                description: "The side length field should contain the competition length of the pool being created.",
                                permitted_values: "Any positive integer.",
                            }}
                        />,
                        validator: (lanes: string) => {
                            try {
                                const lanes_INT = parseInt(lanes);

                                if (lanes_INT > 0) {
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
                        idSuffix: "-measure_unit-text-field",
                        readOnly: false,
                        duplicateSensitive: true,
                        formGroup: <CreationFormGroup
                            label={<InputLabel inputId={idPrefix + "-measure_unit-text-field"} text="Measure unit" />}
                            key={idPrefix + "-measure_unit-text-field"}
                            optional={false}
                            field={<TextInput
                                regex={/^.*$/}
                                placeholderText="Measure unit"
                                pixelWidth={300}
                                idPrefix={idPrefix + "-measure_unit"}
                            />}
                            createInfo={{
                                title: "MEASURE UNIT",
                                description: "The measure unit field should contain the units used to measure the side length of the pool being created.",
                                common_values: "\"Yard,\" \"Meter.\" Pool measure units are usually capitalized and singular.",
                                permitted_values: "Any string at least 1 character long."
                            }}
                        />,
                        validator: (name: string) => {
                            if (name.length > 1) {
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
                modelPageRoute={`meets/${meet_id_INT}/pools`}
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into an account before creating a meet.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the host account for this meet. Log into the host account before creating a pool for this meet.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    }
                ]}
                idPrefix={idPrefix}
                queryParams={{
                    meet_id: meet_id_INT
                }}
                submitText="Create pool"
            />
        </>
    )
}