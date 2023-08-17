import { useId } from "react";
import { useLocation } from "react-router-dom";

import { CreationForm } from "../../utilities/forms/CreationForm.tsx";
import { CreationFormGroup } from "../../utilities/forms/CreationFormGroup.tsx";

import { InputLabel } from "../../utilities/forms/InputLabel.tsx";
import { TextInput } from "../../utilities/inputs/TextInput.tsx";
import { SearchSelect } from "../../utilities/inputs/SearchSelect.tsx";

// ~ component
export function EventCreationForm({ meet_id_INT, event_type }: { meet_id_INT: number, event_type: string }) {
    // * initialize id
    const idPrefix = useId();

    // * initialize location
    const location = useLocation();
    let defaultSession: {name: string, session_id: number} | undefined = undefined;
    try {
        defaultSession = location.state.defaultSession;
    } catch {
        defaultSession = undefined;
    }

    // * create form input fields
    const formInputFields = [
        {
            title: "stroke",
            idSuffix: "-stroke-select-field",
            readOnly: false,
            duplicateSensitive: true,
            formGroup: <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-stroke-select-field"} text="Stroke" />}
                key={idPrefix + "-stroke-select-field"}
                optional={false}
                field={<SearchSelect
                    regex={/^.*$/}
                    otherEnabled={true}
                    placeholderText="Stroke"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-stroke"}
                    options={["Butterfly", "Backstroke", "Breaststroke", "Freestyle", event_type === "relay" ? "Medley" : "IM"]}
                />}
                createInfo={{
                    title: "STROKE",
                    description: "The stroke field should contain the competition stroke of the event being created.",
                    common_values: `Butterfly, Backstroke, Breaststroke, Freestyle, ${event_type === "relay" ? "Medley" : "IM"}`,
                    permitted_values: "Any string. Although the most common values are provided as select options, you may provide any stroke string."
                }}
            />,
            validator: (stroke: string) => {
                if (stroke === "") {
                    return {
                        title: "STROKE FIELD ERROR",
                        description: "The stroke field was left blank. Event strokes are required and can be any string.",
                        fields: "Stroke",
                        recommendation: "Alter the entered event stroke to conform to the requirements of the field."
                    }
                } else {
                    return true;
                }
            }
        },
        {
            title: "distance",
            idSuffix: "-distance-text-field",
            readOnly: false,
            duplicateSensitive: true,
            formGroup: <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-distance-text-field"} text="Distance" />}
                key={idPrefix + "-distance-text-field"}
                optional={false}
                field={<TextInput
                    regex={/^([123456789]([0-9]*))?$/}
                    placeholderText="Distance"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-distance"}
                />}
                createInfo={{
                    title: "DISTANCE",
                    description: "The distance field should contain the competition distance of the event being created.",
                    common_values: event_type === "relay" ? "100, 200, 400, 800" : "25, 50, 100, 200, 400, 500, 800, 1000, 1500, 1650",
                    permitted_values: "Any positive integer."
                }}
            />,
            validator: (distance: string) => {
                try {
                    if (distance === "") {
                        return {
                            title: "DISTANCE FIELD ERROR",
                            description: "The distance field was left blank. Event distances are required and must be any positive integer.",
                            fields: "Distance",
                            recommendation: "Alter the entered event distance to conform to the requirements of the field."
                        }
                    } else if (parseInt(distance) > 0) {
                        return true;
                    } else {
                        return {
                            title: "DISTANCE FIELD ERROR",
                            description: "An invalid value was provided to the event distance field. Event distances must be a positive integer.",
                            fields: "Distance",
                            recommendation: "Alter the entered event distance to conform to the requirements of the field."
                        }
                    }
                } catch {
                    return {
                        title: "DISTANCE FIELD ERROR",
                        description: "An invalid value was provided to the event distance field. Event distances must be a positive integer.",
                        fields: "Distance",
                        recommendation: "Alter the entered event distance to conform to the requirements of the field."
                    }
                }
            },
            converter: (distance: string) => {
                return parseInt(distance);
            }
        },
        {
            title: "stage",
            idSuffix: "-stage-select-field",
            readOnly: false,
            duplicateSensitive: true,
            formGroup: <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-stage-select-field"} text="Stage" />}
                key={idPrefix + "-stage-select-field"}
                optional={false}
                field={<SearchSelect
                    regex={/^.*$/}
                    otherEnabled={true}
                    placeholderText="Stage"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-stage"}
                    options={["Prelim", "Final"]}
                />}
                createInfo={{
                    title: "STAGE",
                    description: "The stage field should contain the competition round of the event being created. This field's value should be \"Final\" unless the meet is a prelims-finals or other round-based meet.",
                    common_values: "Prelim, Final",
                    permitted_values: "Any string. Although the most common values are provided as select options, you may provide any stage string."
                }}
            />,
            validator: (stage: string) => {
                if (stage === "") {
                    return {
                        title: "STAGE FIELD ERROR",
                        description: "The stage field was left blank. Event stages are required and can be any string.",
                        fields: "Stage",
                        recommendation: "Alter the entered event stage to conform to the requirements of the field."
                    }
                } else {
                    return true;
                }
            }
        },
        {
            title: "competing_gender",
            idSuffix: "-competing_gender-select-field",
            readOnly: false,
            duplicateSensitive: true,
            formGroup: <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-competing_gender-select-field"} text="Competing gender" />}
                key={idPrefix + "-competing_gender-select-field"}
                optional={false}
                field={<SearchSelect
                    regex={/^.*$/}
                    otherEnabled={true}
                    placeholderText="Competing gender"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-competing_gender"}
                    options={["Men", "Women", "Boys", "Girls", "Mixed"]}
                />}
                createInfo={{
                    title: "COMPETING GENDER",
                    description: "The competing gender field should contain the pluralized gender allowed to compete in the event being created.",
                    common_values: "Men, Women, Boys, Girls, Mixed",
                    permitted_values: "Any string. Although the most common values are provided as select options, you may provide any competing gender string.",
                    warning: "\"Mixed\" events allow for any gender to compete. Both \"Men\" and \"Boys\" events allow for competitors with the genders \"Man\" and \"Boy\". Both \"Women\" and \"Girls\" events allow for competitors with the genders \"Woman\" and \"Girl\"."
                }}
            />,
            validator: (gender: string) => {
                if (gender === "") {
                    return {
                        title: "COMPETING GENDER FIELD ERROR",
                        description: "The competing gender field was left blank. Event competing genders are required and can be any string.",
                        fields: "Competing gender",
                        recommendation: "Alter the entered event competing gender to conform to the requirements of the field."
                    }
                } else {
                    return true;
                }
            }
        },
        {
            title: "competing_min_age",
            idSuffix: "-competing_min_age-text-field",
            readOnly: false,
            duplicateSensitive: true,
            formGroup: <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-competing_min_age-text-field"} text="Competing min age" />}
                key={idPrefix + "-competing_min_age-text-field"}
                optional={true}
                field={<TextInput
                    regex={/^([123456789]([0-9]*))?$/}
                    placeholderText="Competing min age"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-competing_min_age"}
                />}
                createInfo={{
                    title: "COMPETING MIN AGE",
                    description: "The competing min age field should contain the minimum allowable competitor age of the event being created.",
                    permitted_values: "Empty, or any positive integer.",
                    warning: "An empty competing min age will be interpreted as the event's competing age range having no lower bound. If both the min and max competing age fields are left blank, any age will be allowed."
                }}
            />,
            validator: (min_age: string) => {
                try {
                    if (min_age === "" || parseInt(min_age) > 0) {
                        return true;
                    } else {
                        return {
                            title: "COMPETING MAX AGE FIELD ERROR",
                            description: "An invalid value was provided to the competing max age field. Event competing max ages must be a positive integer.",
                            fields: "Competing max age",
                            recommendation: "Alter the entered event competing max age to conform to the requirements of the field."
                        }
                    }
                } catch {
                    return {
                        title: "COMPETING MAX AGE FIELD ERROR",
                        description: "An invalid value was provided to the competing max age field. Event competing max ages must be a positive integer.",
                        fields: "Competing max age",
                        recommendation: "Alter the entered event competing max age to conform to the requirements of the field."
                    }
                }
            },
            converter: (min_age: string) => {
                if (min_age == "") {
                    return undefined;
                }
                return parseInt(min_age);
            }
        },
        {
            title: "competing_max_age",
            idSuffix: "-competing_max_age-text-field",
            readOnly: false,
            duplicateSensitive: true,
            formGroup: <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-competing_max_age-text-field"} text="Competing max age" />}
                key={idPrefix + "-competing_max_age-text-field"}
                optional={true}
                field={<TextInput
                    regex={/^([123456789]([0-9]*))?$/}
                    placeholderText="Competing max age"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-competing_max_age"}
                />}
                createInfo={{
                    title: "COMPETING MAX AGE",
                    description: "The competing max age field should contain the maximum allowable competitor age of the event being created.",
                    permitted_values: "Empty, or any positive integer.",
                    warning: "An empty competing max age will be interpreted as the event's competing age range having no upper bound. If both the min and max competing age fields are left blank, any age will be allowed."
                }}
            />,
            validator: (max_age: string) => {
                try {
                    if (max_age === "" || parseInt(max_age) > 0) {
                        return true;
                    } else {
                        return {
                            title: "COMPETING MAX AGE FIELD ERROR",
                            description: "An invalid value was provided to the competing max age field. Event competing max ages must be a positive integer.",
                            fields: "Competing max age",
                            recommendation: "Alter the entered event competing max age to conform to the requirements of the field."
                        }
                    }
                } catch {
                    return {
                        title: "COMPETING MAX AGE FIELD ERROR",
                        description: "An invalid value was provided to the competing max age field. Event competing max ages must be a positive integer.",
                        fields: "Competing max age",
                        recommendation: "Alter the entered event competing max age to conform to the requirements of the field."
                    }
                }
            },
            converter: (max_age: string) => {
                if (max_age == "") {
                    return undefined;
                }
                return parseInt(max_age);
            }
        },
        {
            title: "order_in_session",
            idSuffix: "-order_in_session-select-field",
            readOnly: false,
            duplicateSensitive: false,
            formGroup: <CreationFormGroup
                label={<InputLabel inputId={idPrefix + "-order_in_session-select-field"} text="Order in session" />}
                key={idPrefix + "-order_in_session-select-field"}
                optional={false}
                field={<SearchSelect
                    regex={/^(F(i(r(s(t?)?)?)?)?)$|^(L(a(s(t?)?)?)?)$|^([123456789]([0-9]*))?$/}
                    otherEnabled={true}
                    placeholderText="Order"
                    pixelWidth={300}
                    idPrefix={idPrefix + "-order_in_session"}
                    options={["First", "Last"]}
                />}
                createInfo={{
                    title: "ORDER IN SESSION",
                    description: "The order in session field should contain the position of the event being created within the session.",
                    common_values: "First, Last",
                    permitted_values: "\"First,\" \"Last,\" or any positive integer. \"First\" and \"Last\" are shorthands for the first and last positions in the session.",
                    warning: "Other events in the new event's session are impacted by the order number. Events with order numbers greater than or equal to the specified order number will have their order number increase by one."
                }}
            />,
            validator: (order: string) => {
                if (order === "First" || order === "Last" || parseInt(order) > 0) {
                    return true;
                } else if (order === "") {
                    return {
                        title: "ORDER IN SESSION FIELD ERROR",
                        description: "The order in session field was left blank. Event order numbers are required and can be \"First,\" \"Last,\" or any positive integer.",
                        fields: "Order in session",
                        recommendation: "Alter the entered event order number to conform to the requirements of the field."
                    }
                } else {
                    return {
                        title: "ORDER IN SESSION FIELD ERROR",
                        description: "An invalid value was provided to the order in session field. Event order numbers are required and can be \"First,\" \"Last,\" or any positive integer.",
                        fields: "Order in session",
                        recommendation: "Alter the entered event order number to conform to the requirements of the field."
                    }
                }
            },
            converter: (order: string) => {
                if (order === "First") {
                    return "start";
                } else if (order === "Last") {
                    return "end";
                } else {
                    return parseInt(order);
                }
            }
        },
    ]
    if (event_type === "relay") {
        formInputFields.push(
            {
                title: "swimmers_per_entry",
                idSuffix: "-swimmers_per_entry-text-field",
                readOnly: false,
                duplicateSensitive: true,
                formGroup: <CreationFormGroup
                    label={<InputLabel inputId={idPrefix + "-swimmers_per_entry-text-field"} text="Swimmers per relay" />}
                    key={idPrefix + "-swimmers_per_entry-text-field"}
                    optional={false}
                    field={<TextInput
                        regex={/^([123456789]([0-9]*))?$/}
                        placeholderText="Swimmers per relay"
                        pixelWidth={300}
                        idPrefix={idPrefix + "-swimmers_per_entry"}
                    />}
                    createInfo={{
                        title: "SWIMMERS PER RELAY",
                        description: "The swimmers per relay field should contain the number of swimmers in one relay entry of the event being created. For standard relay events, this field's value is always 4.",
                        common_values: "4",
                        permitted_values: "Any positive integer.",
                        warning: "Relay events with the stroke \"Medley\" must have exactly 4 swimmers per entry."
                    }}
                />,
                validator: (num_swimmers: string) => {
                    try {
                        if (num_swimmers === "") {
                            return {
                                title: "SWIMMERS PER RELAY FIELD ERROR",
                                description: "The swimmers per relay field was left blank. Specifying the relay's number of swimmers is required and must be any positive integer.",
                                fields: "Swimmers per relay",
                                recommendation: "Alter the entered number of swimmers per relay to conform to the requirements of the field."
                            }
                        } else if (parseInt(num_swimmers) > 0) {
                            return true;
                        } else {
                            return {
                                title: "SWIMMERS PER RELAY FIELD ERROR",
                                description: "An invalid value was provided to the swimmers per relay field. The number of swimmers relay entry must be a positive integer.",
                                fields: "Swimmers per relay",
                                recommendation: "Alter the entered number of swimmers per relay to conform to the requirements of the field."
                            }
                        }
                    } catch {
                        return {
                            title: "SWIMMERS PER RELAY FIELD ERROR",
                            description: "An invalid value was provided to the swimmers per relay field. The number of swimmers relay entry must be a positive integer.",
                            fields: "Swimmers per relay",
                            recommendation: "Alter the entered number of swimmers per relay to conform to the requirements of the field."
                        }
                    }
                },
                converter: (distance: string) => {
                    return parseInt(distance);
                }
            },
        )
    }

    return (
        <>
            <CreationForm
                formInputFields={formInputFields}
                modelSelectFields={[
                    {
                        queryParamTitle: "session_id",
                        baseInfo: {
                            title: "SESSION",
                            description: "The session field should contain the name of the session during which the event will be ran.",
                            permitted_values: "Any string."
                        },
                        label: <InputLabel inputId={idPrefix + "-session-model-select-field"} text="Session" />,
                        optional: false,
                        placeholderText: "Session",
                        defaultSelection: {
                            text: defaultSession ? defaultSession.name : "",
                            model_id: defaultSession ? defaultSession.session_id : -1
                        },
                        modelInfo: {
                            modelName: "SESSION",
                            specific_to: "meet",
                            apiRoute: "/api/v1/sessions/",
                            id_params: {
                                meet_id: meet_id_INT
                            }
                        }
                    }
                ]}
                destructiveKeepNewInfo={{
                    title: "POTENTIALLY DESTRUCTIVE ACTION",
                    description: "Replacing previously-created duplicate events with this one will result in the deletion of the original events. Are you sure you want to continue?",
                    impact: "Events with the same session, stroke, distance, type, swimmers per relay (if applicable), stage, competing gender, and competing age range as this one will be deleted.",
                    type: "duplicate_keep_new"
                }}
                // destructiveSubmitInfo={{
                //     title: "POTENTIALLY DESTRUCTIVE ACTION",
                //     description: "TEST",
                //     impact: "TEST.",
                //     type: "destructive_submission"
                // }}
                duplicateInfo={{
                    title: "UNHANDLED DUPLICATE EVENTS EXIST",
                    description: "One or more events with the same session, stroke, distance, type, swimmers per relay (if applicable), stage, competing gender, and competing age range exist in your account. How would you like to resolve the duplicate data conflict?",
                    keep_both: true,
                    keep_new: true,
                }}
                rawDataInit={{
                    stroke: "",
                    distance: -1,
                    is_relay: event_type === "relay",
                    swimmers_per_entry: event_type === "relay" ? -1 : 1,
                    stage: "",
                    competing_gender: "",
                    competing_max_age: null,
                    competing_min_age: null,
                    order_in_session: -1
                }}
                apiRoute="/api/v1/events/"
                modelPageRoute={`meets/${meet_id_INT}/events/${event_type}`}
                errorPossibilities={[
                    {
                        matchString: "user is not logged in",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into an account. Log into an account before creating an event for this meet.",
                            recommendation: "Log into an account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "user is not logged into meet host account",
                        error: {
                            title: "AUTHORIZATION ERROR",
                            description: "You are not currently logged into the host account for this meet. Log into the host account before creating an event for this meet.",
                            recommendation: "Log into the host account using the log in button found in the navigation bar."
                        }
                    },
                    {
                        matchString: "no session_id query parameter passed",
                        error: {
                            title: "SESSION FIELD ERROR",
                            description: "No session matching the session name provided in the session field exists. Every event must be associated with a session.",
                            recommendation: "Choose an existing session for the event to be associated with. If no sessions exist, first add a session to the meet."
                        }
                    },
                    {
                        matchString: "no Session with the given id exists",
                        error: {
                            title: "SESSION FIELD ERROR",
                            description: "No session matching the session name provided in the session field exists. Every event must be associated with a session.",
                            recommendation: "Choose an existing session for the event to be associated with. If no sessions exist, first add a session to the meet."
                        }
                    },
                    {
                        matchString: "maximum age less than minimum age",
                        error: {
                            title: "COMPETING AGE RANGE ERROR",
                            description: "The provided maximum competing age was smaller than the provided minimum competing age. Event maximum ages must be greater than or equal to event minimum ages.",
                            recommendation: "Choose maximum and minimum competing ages where the maximum age is greater than or equal to the minimum age."
                        }
                    },
                    {
                        matchString: "swimmers per entry of medley relay is not 4",
                        error: {
                            title: "SWIMMERS PER MEDLEY RELAY ENTRY ERROR",
                            description: "The provided number of swimmers per relay entry was not 4 but the event stroke was \"Medley\". Medley relays must have exactly 4 swimmers per relay.",
                            recommendation: "Either change the number of swimmers per relay to 4 or change the event stroke to a different stroke than \"Medley\"."
                        }
                    }
                ]}
                idPrefix={idPrefix}
                queryParams={{}}
                submitText="Create event"
            />
        </>
    )
}