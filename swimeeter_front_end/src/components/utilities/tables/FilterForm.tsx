import { useEffect, useState } from "react";

import { InfoType } from "../helpers/formTypes.ts";

import { DataForm } from "../forms/DataForm.tsx";
import { NeutralFormGroup } from "../forms/NeutralFormGroup.tsx";

import { InputLabel } from "../forms/InputLabel.tsx";
import { TextInput } from "../inputs/TextInput.tsx";
import { InputButton } from "../inputs/InputButton.tsx";

import { InfoPane } from "../forms/InfoPane.tsx";
import { PageButton } from "../general/PageButton.tsx";
import { IconButton } from "../general/IconButton.tsx";

export function FilterForm({ idPrefix, type, handleSearch }: {
    idPrefix: string,
    type:
    "MEET_OF_ALL"
    | "MEET_OF_HOST"
    | "SESSION_OF_MEET"
    | "SESSION_OF_POOL"
    | "POOL_OF_MEET"
    | "TEAM_OF_MEET"
    | "EVENT_OF_MEET"
    | "EVENT_OF_SESSION"
    | "SWIMMER_OF_MEET"
    | "SWIMMER_OF_TEAM"
    | "INDIVIDUAL_ENTRY_OF_EVENT"
    | "INDIVIDUAL_ENTRY_OF_SWIMMER"
    | "INDIVIDUAL_ENTRY_OF_HEAT"
    | "INDIVIDUAL_ENTRY_OF_TEAM"
    | "RELAY_ENTRY_OF_EVENT"
    | "RELAY_ENTRY_OF_SWIMMER"
    | "RELAY_ENTRY_OF_HEAT"
    | "RELAY_ENTRY_OF_TEAM"
    handleSearch: () => void,
}) {
    // * initialize state
    const [filtersShown, setFiltersShown] = useState<boolean>(false);
    const [searchInfoShown, setSearchInfoShown] = useState<boolean>(false);

    const [formInputs, setFormInputs] = useState<JSX.Element[]>([]);
    const [searchInfo, setSearchInfo] = useState<InfoType>({
        title: "",
        description: ""
    });

    // * determine info and form inputs based on filter type
    useEffect(() => {
        switch (type) {
            case "MEET_OF_ALL":
                setSearchInfo({
                    title: "MEET FILTERS",
                    description: "The meet filter fields are used to narrow the meets listed in the table below by meet name and host name."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-meet_name-search-text-field"}
                                text="Meet name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-meet_name-search"}
                                pixelWidth={200}
                                placeholderText="Meet name"
                            />
                        }
                        baseInfo={{
                            title: "MEET NAME FIELD",
                            description: "The meet name field is used to filter meets by meet name. Only meets with names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-host_first_name-search-text-field"}
                                text="Host first name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-host_first_name-search"}
                                pixelWidth={200}
                                placeholderText="Host first name"
                            />
                        }
                        baseInfo={{
                            title: "HOST FIRST NAME FIELD",
                            description: "The host first name field is used to filter meets by the first name of their host. Only meets with host first names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-host_last_name-search-text-field"}
                                text="Host last name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-host_last_name-search"}
                                pixelWidth={200}
                                placeholderText="Host last name"
                            />
                        }
                        baseInfo={{
                            title: "HOST LAST NAME FIELD",
                            description: "The host last name field is used to filter meets by the last name of their host. Only meets with host last names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;
    
            case "MEET_OF_HOST":
                setSearchInfo({
                    title: "MEET FILTERS",
                    description: "The meet filter fields are used to narrow the meets listed in the table below by meet name."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-meet_name-search-text-field"}
                                text="Meet name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-meet_name-search"}
                                pixelWidth={200}
                                placeholderText="Meet name"
                            />
                        }
                        baseInfo={{
                            title: "MEET NAME FIELD",
                            description: "The meet name field is used to filter meets by meet name. Only meets with names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-visibility-search-text-field"}
                                text="Visibility"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-visibility-search"}
                                pixelWidth={200}
                                placeholderText="Visibility"
                            />
                        }
                        baseInfo={{
                            title: "VISIBILITY FIELD",
                            description: "The visibility field is used to filter meets by their visibility. Only meets with visibilities that exactly match the provided value will be shown in the table below.",
                            permitted_values: "Either \"Public\" or \"Private.\""
                        }}
                    />
                ]);
                break;
    
            case "SESSION_OF_POOL":
                setSearchInfo({
                    title: "SESSION FILTERS",
                    description: "The session filter fields are used to narrow the sessions listed in the table below by session name."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-session_name-search-text-field"}
                                text="Session name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-session_name-search"}
                                pixelWidth={200}
                                placeholderText="Session name"
                            />
                        }
                        baseInfo={{
                            title: "SESSION NAME FIELD",
                            description: "The session name field is used to filter sessions by sessions name. Only sessions with names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;

            case "SESSION_OF_MEET":
                setSearchInfo({
                    title: "SESSION FILTERS",
                    description: "The session filter fields are used to narrow the sessions listed in the table below by session name and pool name."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-session_name-search-text-field"}
                                text="Session name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-session_name-search"}
                                pixelWidth={200}
                                placeholderText="Session name"
                            />
                        }
                        baseInfo={{
                            title: "SESSION NAME FIELD",
                            description: "The session name field is used to filter sessions by sessions name. Only sessions with names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-pool_name-search-text-field"}
                                text="Pool name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-pool_name-search"}
                                pixelWidth={200}
                                placeholderText="Pool name"
                            />
                        }
                        baseInfo={{
                            title: "POOL NAME FIELD",
                            description: "The pool name field is used to filter sessions by pool name. Only sessions with pool names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;
    
            case "POOL_OF_MEET":
                setSearchInfo({
                    title: "POOL FILTERS",
                    description: "The pool filter fields are used to narrow the pools listed in the table below by pool name, number of lanes, side length, and measure unit."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-pool_name-search-text-field"}
                                text="Pool name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-pool_name-search"}
                                pixelWidth={200}
                                placeholderText="Pool name"
                            />
                        }
                        baseInfo={{
                            title: "POOL NAME FIELD",
                            description: "The pool name field is used to filter pools by pool name. Only pools with names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-number_of_lanes-search-text-field"}
                                text="Number of lanes"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-number_of_lanes-search"}
                                pixelWidth={200}
                                placeholderText="Number of lanes"
                            />
                        }
                        baseInfo={{
                            title: "NUMBER OF LANES FIELD",
                            description: "The number of lanes field is used to filter pools by their number of lanes. Only pools with the provided number of lanes will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-side_length-search-text-field"}
                                text="Side length"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-side_length-search"}
                                pixelWidth={200}
                                placeholderText="Side length"
                            />
                        }
                        baseInfo={{
                            title: "SIDE LENGTH FIELD",
                            description: "The side length field is used to filter pools by their side length. Only pools with the provided side length will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-measure_unit-search-text-field"}
                                text="Measure unit"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-measure_unit-search"}
                                pixelWidth={200}
                                placeholderText="Measure unit"
                            />
                        }
                        baseInfo={{
                            title: "MEASURE UNIT FIELD",
                            description: "The measure unit field is used to filter pools by length measuring units. Only pools with measure units that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;
    
            case "TEAM_OF_MEET":
                setSearchInfo({
                    title: "TEAM FILTERS",
                    description: "The team filter fields are used to narrow the teams listed in the table below by team name and acronym."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-team_name-search-text-field"}
                                text="Team name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-team_name-search"}
                                pixelWidth={200}
                                placeholderText="Team name"
                            />
                        }
                        baseInfo={{
                            title: "TEAM NAME FIELD",
                            description: "The team name field is used to filter teams by team name. Only teams with names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-team_acronym-search-text-field"}
                                text="Team acronym"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-team_acronym-search"}
                                pixelWidth={200}
                                placeholderText="Team acronym"
                            />
                        }
                        baseInfo={{
                            title: "TEAM ACRONYM FIELD",
                            description: "The team acronym field is used to filter teams by team acronym. Only teams with acronyms that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;
    
            case "EVENT_OF_MEET":
                setSearchInfo({
                    title: "EVENT FILTERS",
                    description: "The event filter fields are used to narrow the events listed in the table below by session name and event stroke, distance, minimum competing age, maximum competing age, and competing gender."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-distance-search-text-field"}
                                text="Distance"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-distance-search"}
                                pixelWidth={200}
                                placeholderText="Distance"
                            />
                        }
                        baseInfo={{
                            title: "DISTANCE FIELD",
                            description: "The distance field is used to filter events by competition distance. Only events with the provided distance will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-stroke-search-text-field"}
                                text="Stroke"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-stroke-search"}
                                pixelWidth={200}
                                placeholderText="Stroke"
                            />
                        }
                        baseInfo={{
                            title: "STROKE FIELD",
                            description: "The stroke field is used to filter events by competition stroke. Only events with strokes that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-minimum_age-search-text-field"}
                                text="Minimum age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-minimum_age-search"}
                                pixelWidth={200}
                                placeholderText="Minimum age"
                            />
                        }
                        baseInfo={{
                            title: "MINIMUM AGE FIELD",
                            description: "The minimum age field is used to filter events by competitor minimum age. Only events with the provided minimum competing age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-maximum_age-search-text-field"}
                                text="Maximum age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-maximum_age-search"}
                                pixelWidth={200}
                                placeholderText="Maximum age"
                            />
                        }
                        baseInfo={{
                            title: "MAXIMUM AGE FIELD",
                            description: "The maximum age field is used to filter events by competitor maximum age. Only events with the provided maximum competing age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-gender-search-text-field"}
                                text="Gender"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-gender-search"}
                                pixelWidth={200}
                                placeholderText="Gender"
                            />
                        }
                        baseInfo={{
                            title: "GENDER FIELD",
                            description: "The gender field is used to filter events by competitor gender. Only events with competing genders that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-stage-search-text-field"}
                                text="Stage"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-stage-search"}
                                pixelWidth={200}
                                placeholderText="Stage"
                            />
                        }
                        baseInfo={{
                            title: "STAGE FIELD",
                            description: "The stage field is used to filter events by competition round. Only events with stages that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-session_name-search-text-field"}
                                text="Session name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-session_name-search"}
                                pixelWidth={200}
                                placeholderText="Session name"
                            />
                        }
                        baseInfo={{
                            title: "SESSION NAME FIELD",
                            description: "The session name field is used to filter events by session name. Only events with session names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;
    
            case "EVENT_OF_SESSION":
                setSearchInfo({
                    title: "EVENT FILTERS",
                    description: "The event filter fields are used to narrow the events listed in the table below by event stroke, distance, minimum competing age, maximum competing age, and competing gender."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-distance-search-text-field"}
                                text="Distance"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-distance-search"}
                                pixelWidth={200}
                                placeholderText="Distance"
                            />
                        }
                        baseInfo={{
                            title: "DISTANCE FIELD",
                            description: "The distance field is used to filter events by competition distance. Only events with the provided distance will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-stroke-search-text-field"}
                                text="Stroke"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-stroke-search"}
                                pixelWidth={200}
                                placeholderText="Stroke"
                            />
                        }
                        baseInfo={{
                            title: "STROKE FIELD",
                            description: "The stroke field is used to filter events by competition stroke. Only events with strokes that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-minimum_age-search-text-field"}
                                text="Minimum age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-minimum_age-search"}
                                pixelWidth={200}
                                placeholderText="Minimum age"
                            />
                        }
                        baseInfo={{
                            title: "MINIMUM AGE FIELD",
                            description: "The minimum age field is used to filter events by competitor minimum age. Only events with the provided minimum competing age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-maximum_age-search-text-field"}
                                text="Maximum age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-maximum_age-search"}
                                pixelWidth={200}
                                placeholderText="Maximum age"
                            />
                        }
                        baseInfo={{
                            title: "MAXIMUM AGE FIELD",
                            description: "The maximum age field is used to filter events by competitor maximum age. Only events with the provided maximum competing age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-gender-search-text-field"}
                                text="Gender"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-gender-search"}
                                pixelWidth={200}
                                placeholderText="Gender"
                            />
                        }
                        baseInfo={{
                            title: "GENDER FIELD",
                            description: "The gender field is used to filter events by competitor gender. Only events with competing genders that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-stage-search-text-field"}
                                text="Stage"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-stage-search"}
                                pixelWidth={200}
                                placeholderText="Stage"
                            />
                        }
                        baseInfo={{
                            title: "STAGE FIELD",
                            description: "The stage field is used to filter events by competition round. Only events with stages that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;
    
            case "SWIMMER_OF_MEET":
                setSearchInfo({
                    title: "SWIMMER FILTERS",
                    description: "The swimmer filter fields are used to narrow the swimmers listed in the table below by swimmer name, age, and gender and team name and acronym."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-swimmer_first_name-search-text-field"}
                                text="First name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-swimmer_first_name-search"}
                                pixelWidth={200}
                                placeholderText="First name"
                            />
                        }
                        baseInfo={{
                            title: "SWIMMER FIRST NAME FIELD",
                            description: "The swimmer first name field is used to filter swimmers by their first name. Only swimmers with first names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-swimmer_last_name-search-text-field"}
                                text="Last name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-swimmer_last_name-search"}
                                pixelWidth={200}
                                placeholderText="Last name"
                            />
                        }
                        baseInfo={{
                            title: "SWIMMER LAST NAME FIELD",
                            description: "The swimmer last name field is used to filter swimmers by their last name. Only swimmers with last names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-age-search-text-field"}
                                text="Age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-age-search"}
                                pixelWidth={200}
                                placeholderText="Age"
                            />
                        }
                        baseInfo={{
                            title: "AGE FIELD",
                            description: "The age field is used to filter swimmers by their age. Only swimmers with the provided age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-gender-search-text-field"}
                                text="Gender"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-gender-search"}
                                pixelWidth={200}
                                placeholderText="Gender"
                            />
                        }
                        baseInfo={{
                            title: "GENDER FIELD",
                            description: "The gender field is used to filter swimmers by their gender. Only swimmers with genders that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-team_name-search-text-field"}
                                text="Team name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-team_name-search"}
                                pixelWidth={200}
                                placeholderText="Team name"
                            />
                        }
                        baseInfo={{
                            title: "TEAM NAME FIELD",
                            description: "The team name field is used to filter swimmers by team name. Only swimmers with team names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-team_acronym-search-text-field"}
                                text="Team acronym"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-team_acronym-search"}
                                pixelWidth={200}
                                placeholderText="Team acronym"
                            />
                        }
                        baseInfo={{
                            title: "TEAM ACRONYM FIELD",
                            description: "The team acronym field is used to filter swimmers by team acronym. Only swimmers with team acronyms that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;
    
            case "SWIMMER_OF_TEAM":
                setSearchInfo({
                    title: "SWIMMER FILTERS",
                    description: "The swimmer filter fields are used to narrow the swimmers listed in the table below by swimmer name, age, and gender."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-swimmer_first_name-search-text-field"}
                                text="First name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-swimmer_first_name-search"}
                                pixelWidth={200}
                                placeholderText="First name"
                            />
                        }
                        baseInfo={{
                            title: "SWIMMER FIRST NAME FIELD",
                            description: "The swimmer first name field is used to filter swimmers by their first name. Only swimmers with first names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-swimmer_last_name-search-text-field"}
                                text="Last name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-swimmer_last_name-search"}
                                pixelWidth={200}
                                placeholderText="Last name"
                            />
                        }
                        baseInfo={{
                            title: "SWIMMER LAST NAME FIELD",
                            description: "The swimmer last name field is used to filter swimmers by their last name. Only swimmers with last names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-age-search-text-field"}
                                text="Age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-age-search"}
                                pixelWidth={200}
                                placeholderText="Age"
                            />
                        }
                        baseInfo={{
                            title: "AGE FIELD",
                            description: "The age field is used to filter swimmers by their age. Only swimmers with the provided age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-gender-search-text-field"}
                                text="Gender"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-gender-search"}
                                pixelWidth={200}
                                placeholderText="Gender"
                            />
                        }
                        baseInfo={{
                            title: "GENDER FIELD",
                            description: "The gender field is used to filter swimmers by their gender. Only swimmers with genders that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;
    
            case "INDIVIDUAL_ENTRY_OF_HEAT":
            case "INDIVIDUAL_ENTRY_OF_EVENT":
                setSearchInfo({
                    title: "INDIVIDUAL ENTRY FILTERS",
                    description: "The individual entry filter fields are used to narrow the individual entries listed in the table below by swimmer name, age, and gender and swimmer team name and acronym."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-swimmer_first_name-search-text-field"}
                                text="First name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-swimmer_first_name-search"}
                                pixelWidth={200}
                                placeholderText="First name"
                            />
                        }
                        baseInfo={{
                            title: "SWIMMER FIRST NAME FIELD",
                            description: "The swimmer first name field is used to filter individual entries by swimmer first name. Only individual entries with swimmer first names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-swimmer_last_name-search-text-field"}
                                text="Last name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-swimmer_last_name-search"}
                                pixelWidth={200}
                                placeholderText="Last name"
                            />
                        }
                        baseInfo={{
                            title: "SWIMMER LAST NAME FIELD",
                            description: "The swimmer last name field is used to filter individual entries by swimmer last name. Only individual entries with swimmer last names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-age-search-text-field"}
                                text="Age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-age-search"}
                                pixelWidth={200}
                                placeholderText="Age"
                            />
                        }
                        baseInfo={{
                            title: "AGE FIELD",
                            description: "The age field is used to filter individual entries by swimmer age. Only individual entries with the provided swimmer age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-gender-search-text-field"}
                                text="Gender"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-gender-search"}
                                pixelWidth={200}
                                placeholderText="Gender"
                            />
                        }
                        baseInfo={{
                            title: "GENDER FIELD",
                            description: "The gender field is used to filter individual entries by swimmer gender. Only individual entries with swimmer genders that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-team_name-search-text-field"}
                                text="Team name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-team_name-search"}
                                pixelWidth={200}
                                placeholderText="Team name"
                            />
                        }
                        baseInfo={{
                            title: "TEAM NAME FIELD",
                            description: "The team name field is used to filter individual entries by swimmer team name. Only individual entries with swimmer team names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-team_acronym-search-text-field"}
                                text="Team acronym"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-team_acronym-search"}
                                pixelWidth={200}
                                placeholderText="Team acronym"
                            />
                        }
                        baseInfo={{
                            title: "TEAM ACRONYM FIELD",
                            description: "The team acronym field is used to filter individual entries by swimmer team acronym. Only individual entries with swimmer team acronyms that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;
    
            case "INDIVIDUAL_ENTRY_OF_SWIMMER":
                setSearchInfo({
                    title: "INDIVIDUAL ENTRY FILTERS",
                    description: "The individual entry filter fields are used to narrow the individual entries listed in the table below by event session name and event stroke, distance, minimum competing age, maximum competing age, and competing gender."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-distance-search-text-field"}
                                text="Distance"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-distance-search"}
                                pixelWidth={200}
                                placeholderText="Distance"
                            />
                        }
                        baseInfo={{
                            title: "DISTANCE FIELD",
                            description: "The distance field is used to filter individual entries by competition distance. Only individual entries with the provided event distance will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-stroke-search-text-field"}
                                text="Stroke"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-stroke-search"}
                                pixelWidth={200}
                                placeholderText="Stroke"
                            />
                        }
                        baseInfo={{
                            title: "STROKE FIELD",
                            description: "The stroke field is used to filter individual entries by event stroke. Only individual entries with event strokes that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-minimum_age-search-text-field"}
                                text="Minimum age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-minimum_age-search"}
                                pixelWidth={200}
                                placeholderText="Minimum age"
                            />
                        }
                        baseInfo={{
                            title: "MINIMUM AGE FIELD",
                            description: "The minimum age field is used to filter individual entries by event minimum age. Only individual entries with the provided event minimum competing age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-maximum_age-search-text-field"}
                                text="Maximum age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-maximum_age-search"}
                                pixelWidth={200}
                                placeholderText="Maximum age"
                            />
                        }
                        baseInfo={{
                            title: "MAXIMUM AGE FIELD",
                            description: "The maximum age field is used to filter individual entries by event maximum age. Only individual entries with the provided event maximum competing age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-gender-search-text-field"}
                                text="Gender"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-gender-search"}
                                pixelWidth={200}
                                placeholderText="Gender"
                            />
                        }
                        baseInfo={{
                            title: "GENDER FIELD",
                            description: "The gender field is used to filter individual entries by event gender. Only individual entries with event competing genders that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-stage-search-text-field"}
                                text="Stage"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-stage-search"}
                                pixelWidth={200}
                                placeholderText="Stage"
                            />
                        }
                        baseInfo={{
                            title: "STAGE FIELD",
                            description: "The stage field is used to filter individual entries by event competition round. Only individual entries with event stages that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-session_name-search-text-field"}
                                text="Session name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-session_name-search"}
                                pixelWidth={200}
                                placeholderText="Session name"
                            />
                        }
                        baseInfo={{
                            title: "SESSION NAME FIELD",
                            description: "The session name field is used to filter individual entries by event session name. Only individual entries with event session names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;
    
            case "INDIVIDUAL_ENTRY_OF_TEAM":
                setSearchInfo({
                    title: "INDIVIDUAL ENTRY FILTERS",
                    description: "The individual entry filter fields are used to narrow the individual entries listed in the table below by the information associated with each entry's swimmer and event."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-event-distance-search-text-field"}
                                text="Event distance"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-event-distance-search"}
                                pixelWidth={200}
                                placeholderText="Event distance"
                            />
                        }
                        baseInfo={{
                            title: "EVENT DISTANCE FIELD",
                            description: "The event distance field is used to filter individual entries by competition distance. Only individual entries with the provided event distance will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-event-stroke-search-text-field"}
                                text="Event stroke"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-event-stroke-search"}
                                pixelWidth={200}
                                placeholderText="Event stroke"
                            />
                        }
                        baseInfo={{
                            title: "EVENT STROKE FIELD",
                            description: "The event stroke field is used to filter individual entries by event stroke. Only individual entries with event strokes that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-event-minimum_age-search-text-field"}
                                text="Event minimum age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-event-minimum_age-search"}
                                pixelWidth={200}
                                placeholderText="Event minimum age"
                            />
                        }
                        baseInfo={{
                            title: "EVENT MINIMUM AGE FIELD",
                            description: "The event minimum age field is used to filter individual entries by event minimum age. Only individual entries with the provided event minimum competing age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-event-maximum_age-search-text-field"}
                                text="Event maximum age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-event-maximum_age-search"}
                                pixelWidth={200}
                                placeholderText="Event maximum age"
                            />
                        }
                        baseInfo={{
                            title: "EVENT MAXIMUM AGE FIELD",
                            description: "The event maximum age field is used to filter individual entries by event maximum age. Only individual entries with the provided event maximum competing age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-event-gender-search-text-field"}
                                text="Event gender"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-event-gender-search"}
                                pixelWidth={200}
                                placeholderText="Event gender"
                            />
                        }
                        baseInfo={{
                            title: "EVENT GENDER FIELD",
                            description: "The event gender field is used to filter individual entries by event gender. Only individual entries with event competing genders that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-event-stage-search-text-field"}
                                text="Event stage"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-event-stage-search"}
                                pixelWidth={200}
                                placeholderText="Event stage"
                            />
                        }
                        baseInfo={{
                            title: "EVENT STAGE FIELD",
                            description: "The event stage field is used to filter individual entries by event competition round. Only individual entries with event stages that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-event-session_name-search-text-field"}
                                text="Event session name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-event-session_name-search"}
                                pixelWidth={200}
                                placeholderText="Event session name"
                            />
                        }
                        baseInfo={{
                            title: "EVENT SESSION NAME FIELD",
                            description: "The event session name field is used to filter individual entries by event session name. Only individual entries with event session names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-swimmer-first_name-search-text-field"}
                                text="First name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-swimmer-first_name-search"}
                                pixelWidth={200}
                                placeholderText="First name"
                            />
                        }
                        baseInfo={{
                            title: "SWIMMER FIRST NAME FIELD",
                            description: "The swimmer first name field is used to filter individual entries by swimmer first name. Only individual entries with swimmer first names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-swimmer-last_name-search-text-field"}
                                text="Last name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-swimmer-last_name-search"}
                                pixelWidth={200}
                                placeholderText="Last name"
                            />
                        }
                        baseInfo={{
                            title: "SWIMMER LAST NAME FIELD",
                            description: "The swimmer last name field is used to filter individual entries by swimmer last name. Only individual entries with swimmer last names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-swimmer-age-search-text-field"}
                                text="Swimmer age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-swimmer-age-search"}
                                pixelWidth={200}
                                placeholderText="Swimmer age"
                            />
                        }
                        baseInfo={{
                            title: "SWIMMER AGE FIELD",
                            description: "The swimmer age field is used to filter individual entries by swimmer age. Only individual entries with the provided swimmer age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-swimmer-gender-search-text-field"}
                                text="Swimmer gender"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-swimmer-gender-search"}
                                pixelWidth={200}
                                placeholderText="Swimmer gender"
                            />
                        }
                        baseInfo={{
                            title: "SWIMMER GENDER FIELD",
                            description: "The swimmer gender field is used to filter individual entries by swimmer gender. Only individual entries with swimmer genders that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />
                ]);
                break;
    
            case "RELAY_ENTRY_OF_HEAT":
            case "RELAY_ENTRY_OF_EVENT":
                setSearchInfo({
                    title: "RELAY ENTRY FILTERS",
                    description: "The relay entry filter fields are used to narrow the relay entries listed in the table below by participant swimmer names and team name and acronym."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-team_name-search-text-field"}
                                text="Team name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-team_name-search"}
                                pixelWidth={200}
                                placeholderText="Team name"
                            />
                        }
                        baseInfo={{
                            title: "TEAM NAME FIELD",
                            description: "The team name field is used to filter relay entries by participating team name. Only relay entries with team names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-team_acronym-search-text-field"}
                                text="Team acronym"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-team_acronym-search"}
                                pixelWidth={200}
                                placeholderText="Team acronym"
                            />
                        }
                        baseInfo={{
                            title: "TEAM ACRONYM FIELD",
                            description: "The team acronym field is used to filter relay entries by participating team acronym. Only relay entries with team acronyms that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-participant_first_names-search-text-field"}
                                text="Participant first names"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-participant_first_names-search"}
                                pixelWidth={200}
                                placeholderText="Participant first names"
                            />
                        }
                        baseInfo={{
                            title: "PARTICIPANT FIRST NAMES FIELD",
                            description: "The participant names field is used to filter relay entries by the first names of their swimmers. Only relay entries with swimmer first names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Participant names must be separated by a comma and a space. For example, relay participant names might look like: \"John, Jack, Jane, Jen\""
                        }}
                    />
                ]);
                break;
    
            case "RELAY_ENTRY_OF_SWIMMER":
            case "RELAY_ENTRY_OF_TEAM":
                setSearchInfo({
                    title: "RELAY ENTRY FILTERS",
                    description: "The relay entry filter fields are used to narrow the relay entries listed in the table below by event session name, event stroke, distance, minimum competing age, maximum competing age, and competing gender, and participant swimmer names."
                });
                setFormInputs([
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-distance-search-text-field"}
                                text="Distance"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-distance-search"}
                                pixelWidth={200}
                                placeholderText="Distance"
                            />
                        }
                        baseInfo={{
                            title: "DISTANCE FIELD",
                            description: "The distance field is used to filter relay entries by competition distance. Only relay entries with the provided event distance will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-stroke-search-text-field"}
                                text="Stroke"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-stroke-search"}
                                pixelWidth={200}
                                placeholderText="Stroke"
                            />
                        }
                        baseInfo={{
                            title: "STROKE FIELD",
                            description: "The stroke field is used to filter relay entries by event stroke. Only relay entries with event strokes that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-minimum_age-search-text-field"}
                                text="Minimum age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-minimum_age-search"}
                                pixelWidth={200}
                                placeholderText="Minimum age"
                            />
                        }
                        baseInfo={{
                            title: "MINIMUM AGE FIELD",
                            description: "The minimum age field is used to filter relay entries by event minimum age. Only relay entries with the provided event minimum competing age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-maximum_age-search-text-field"}
                                text="Maximum age"
                            />}
                        field={
                            <TextInput
                                regex={/^$|^[123456789][0-9]*$/}
                                idPrefix={idPrefix + "-maximum_age-search"}
                                pixelWidth={200}
                                placeholderText="Maximum age"
                            />
                        }
                        baseInfo={{
                            title: "MAXIMUM AGE FIELD",
                            description: "The maximum age field is used to filter relay entries by event maximum age. Only relay entries with the provided event maximum competing age will be shown in the table below.",
                            permitted_values: "Any positive integer."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-gender-search-text-field"}
                                text="Gender"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-gender-search"}
                                pixelWidth={200}
                                placeholderText="Gender"
                            />
                        }
                        baseInfo={{
                            title: "GENDER FIELD",
                            description: "The gender field is used to filter relay entries by event gender. Only relay entries with event competing genders that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-stage-search-text-field"}
                                text="Stage"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-stage-search"}
                                pixelWidth={200}
                                placeholderText="Stage"
                            />
                        }
                        baseInfo={{
                            title: "STAGE FIELD",
                            description: "The stage field is used to filter relay entries by event competition round. Only relay entries with event stages that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-session_name-search-text-field"}
                                text="Session name"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-session_name-search"}
                                pixelWidth={200}
                                placeholderText="Session name"
                            />
                        }
                        baseInfo={{
                            title: "SESSION NAME FIELD",
                            description: "The session name field is used to filter relay entries by event session name. Only relay entries with event session names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Any string."
                        }}
                    />,
                    <NeutralFormGroup
                        label={
                            <InputLabel
                                inputId={idPrefix + "-participant_first_names-search-text-field"}
                                text="Participant first names"
                            />}
                        field={
                            <TextInput
                                regex={/^.*$/}
                                idPrefix={idPrefix + "-participant_first_names-search"}
                                pixelWidth={200}
                                placeholderText="Participant first names"
                            />
                        }
                        baseInfo={{
                            title: "PARTICIPANT FIRST NAMES FIELD",
                            description: "The participant names field is used to filter relay entries by the first names of their swimmers. Only relay entries with swimmer first names that begin with the provided value will be shown in the table below.",
                            permitted_values: "Participant names must be separated by a comma and a space. For example, relay participant names might look like: \"John, Jack, Jane, Jen\""
                        }}
                    />
                ]);
                break;
        }
    }, []);

    return (
        <div className="flex flex-col gap-y-2 max-w-[75%]">
            {searchInfoShown && filtersShown && <InfoPane info={searchInfo} handleXClick={() => setSearchInfoShown(false)} />}
            <div className="flex flex-row items-center gap-x-2">
                <PageButton color="purple" icon={filtersShown ? "EYE_CLOSED" : "EYE_OPEN"} text={filtersShown ? "Hide filters" : "Show filters"} handleClick={() => { setFiltersShown(!filtersShown) }} />
                {filtersShown && <IconButton color="primary" icon="CIRCLE_INFO" handleClick={() => setSearchInfoShown(!searchInfoShown)} />}
            </div>
            <div className={filtersShown ? "" : "hidden"}>
                <DataForm>
                    {formInputs}
                    <InputButton idPrefix={idPrefix + "-submit"} color="green" icon="FILTER" text="Filter meets" type="submit" handleClick={(event: any) => {
                        event.preventDefault();
                        handleSearch();
                    }} />
                </DataForm>
            </div>
        </div>
    );
}