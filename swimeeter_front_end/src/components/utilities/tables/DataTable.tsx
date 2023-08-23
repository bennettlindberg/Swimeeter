import { useEffect, useId, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { TableGrid } from "../../utilities/tables/TableGrid.tsx";
import { TableHeader } from "../../utilities/tables/TableHeader.tsx";

import { PageButton } from "../../utilities/general/PageButton.tsx";
import { FilterForm } from "./FilterForm.tsx";
import { MainContentText } from "../../utilities/main_content/MainContentText.tsx";

type TableState = {
    nextToLoad: number,
    loadedAllData: boolean,
    searchEntry: { [key: string]: any },
    data: any[]
}

type TableAction = {
    type: "LOADED_ALL_DATA"
} | {
    type: "NEW_BATCH_RETRIEVED"
    data: any[]
} | {
    type: "NEW_SEARCH_ENTRY",
    searchEntry: Object
}

function tableReducer(state: TableState, action: TableAction) {
    switch (action.type) {
        case "NEW_BATCH_RETRIEVED":
            return {
                ...state,
                nextToLoad: state.nextToLoad + 10,
                data: [
                    ...state.data,
                    ...action.data
                ]
            } as TableState;

        case "LOADED_ALL_DATA":
            return {
                ...state,
                loadedAllData: true
            } as TableState;

        case "NEW_SEARCH_ENTRY":
            return {
                nextToLoad: 0,
                loadedAllData: false,
                searchEntry: action.searchEntry,
                data: []
            } as TableState;
    }
}

// ~ component
export function DataTable({
    apiRoute,
    queryParams,
    searchType,
    tableBarItems,
    tableBarHostItems,
    tableCols,
    tableHeaderTitles,
    tableRowGenerator,
    noneFoundText,
    loadMoreText,
    isMeetHost
}: {
    apiRoute: string,
    queryParams: Object,
    searchType:
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
    tableBarItems: JSX.Element[],
    tableBarHostItems: JSX.Element[],
    tableCols: JSX.Element[],
    tableHeaderTitles: string[],
    tableRowGenerator: (x: any) => JSX.Element,
    noneFoundText: string,
    loadMoreText: string,
    isMeetHost: boolean
}) {
    // * initialize navigation, and id
    const navigate = useNavigate();
    const idPrefix = useId();

    // * initialize state
    const [tableShown, setTableShown] = useState<boolean>(true);
    const [tableState, tableDispatch] = useReducer(tableReducer, {
        nextToLoad: 0,
        loadedAllData: false,
        searchEntry: {},
        data: []
    });

    // * define load more data handler
    async function handleLoadMore() {
        if (tableState.loadedAllData) {
            return;
        }

        // @ make request to back-end for next data batch
        try {
            const response = await axios.get(apiRoute, {
                params: {
                    ...queryParams,
                    lower_bound: tableState.nextToLoad,
                    upper_bound: tableState.nextToLoad + 10,
                    ...tableState.searchEntry
                }
            });

            const newData: any[] = [];

            for (const modelJSON of response.data) {
                newData.push(modelJSON);
            }

            tableDispatch({
                type: "NEW_BATCH_RETRIEVED",
                data: newData
            });

            if (newData.length < 10) {
                tableDispatch({
                    type: "LOADED_ALL_DATA"
                });
            }
        } catch (error) {
            // ? back-end error
            navigate("/errors/unknown");
        }
    }

    // * define new search validator
    function validateNewSearch(newSearchEntry: { [key: string]: any }, oldSearchEntry: { [key: string]: any }) {
        for (const key in newSearchEntry) {
            const old = oldSearchEntry[key];
            if (old === undefined || old !== newSearchEntry[key]) {
                return true;
            }
        }
        return false;
    }

    // * define search submit handler
    function handleSearchSubmit() {
        switch (searchType) {
            case "MEET_OF_ALL": {
                try {
                    const meetNameField = document.getElementById(idPrefix + "-meet_name-search-text-field") as HTMLInputElement;
                    const meetNameValue = meetNameField.value;

                    const hostFirstNameField = document.getElementById(idPrefix + "-host_first_name-search-text-field") as HTMLInputElement;
                    const hostFirstNameValue = hostFirstNameField.value;

                    const hostLastNameField = document.getElementById(idPrefix + "-host_last_name-search-text-field") as HTMLInputElement;
                    const hostLastNameValue = hostLastNameField.value;

                    const newSearchEntry = {
                        search__name: meetNameValue || undefined,
                        search__host_first_name: hostFirstNameValue || undefined,
                        search__host_last_name: hostLastNameValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "MEET_OF_HOST": {
                try {
                    const meetNameField = document.getElementById(idPrefix + "-meet_name-search-text-field") as HTMLInputElement;
                    const meetNameValue = meetNameField.value;

                    const visibilityField = document.getElementById(idPrefix + "-visibility-search-text-field") as HTMLInputElement;
                    const visibilityValue = visibilityField.value;

                    const newSearchEntry = {
                        search__name: meetNameValue || undefined,
                        search__is_public: visibilityValue === "Public" ? true : visibilityValue === "Private" ? false : undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "SESSION_OF_POOL": {
                try {
                    const sessionNameField = document.getElementById(idPrefix + "-session_name-search-text-field") as HTMLInputElement;
                    const sessionNameValue = sessionNameField.value;

                    const newSearchEntry = {
                        search__name: sessionNameValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "SESSION_OF_MEET": {
                try {
                    const sessionNameField = document.getElementById(idPrefix + "-session_name-search-text-field") as HTMLInputElement;
                    const sessionNameValue = sessionNameField.value;

                    const poolNameField = document.getElementById(idPrefix + "-pool_name-search-text-field") as HTMLInputElement;
                    const poolNameValue = poolNameField.value;

                    const newSearchEntry = {
                        search__session_name: sessionNameValue || undefined,
                        search__pool_name: poolNameValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "POOL_OF_MEET": {
                try {
                    const poolNameField = document.getElementById(idPrefix + "-pool_name-search-text-field") as HTMLInputElement;
                    const poolNameValue = poolNameField.value;

                    const numberOfLanesField = document.getElementById(idPrefix + "-number_of_lanes-search-text-field") as HTMLInputElement;
                    const numberOfLanesValue = parseInt(numberOfLanesField.value || "-1");

                    const sideLengthField = document.getElementById(idPrefix + "-side_length-search-text-field") as HTMLInputElement;
                    const sideLengthValue = parseInt(sideLengthField.value || "-1");

                    const measureUnitsField = document.getElementById(idPrefix + "-measure_unit-search-text-field") as HTMLInputElement;
                    const measureUnitsValue = measureUnitsField.value;

                    const newSearchEntry = {
                        search__name: poolNameValue || undefined,
                        search__lanes: numberOfLanesValue === -1 ? undefined : numberOfLanesValue,
                        search__side_length: sideLengthValue === -1 ? undefined : sideLengthValue,
                        search__measure_unit: measureUnitsValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "TEAM_OF_MEET": {
                try {
                    const teamNameField = document.getElementById(idPrefix + "-team_name-search-text-field") as HTMLInputElement;
                    const teamNameValue = teamNameField.value;

                    const teamAcronymField = document.getElementById(idPrefix + "-team_acronym-search-text-field") as HTMLInputElement;
                    const teamAcronymValue = teamAcronymField.value;

                    const newSearchEntry = {
                        search__name: teamNameValue || undefined,
                        search__acronym: teamAcronymValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "INDIVIDUAL_ENTRY_OF_SWIMMER":
            case "EVENT_OF_MEET": {
                try {
                    const strokeField = document.getElementById(idPrefix + "-stroke-search-text-field") as HTMLInputElement;
                    const strokeValue = strokeField.value;

                    const distanceField = document.getElementById(idPrefix + "-distance-search-text-field") as HTMLInputElement;
                    const distanceValue = parseInt(distanceField.value || "-1");

                    const minAgeField = document.getElementById(idPrefix + "-minimum_age-search-text-field") as HTMLInputElement;
                    const minAgeValue = parseInt(minAgeField.value || "-1");

                    const maxAgeField = document.getElementById(idPrefix + "-maximum_age-search-text-field") as HTMLInputElement;
                    const maxAgeValue = parseInt(maxAgeField.value || "-1");

                    const genderField = document.getElementById(idPrefix + "-gender-search-text-field") as HTMLInputElement;
                    const genderValue = genderField.value;

                    const stageField = document.getElementById(idPrefix + "-stage-search-text-field") as HTMLInputElement;
                    const stageValue = stageField.value;

                    const sessionNameField = document.getElementById(idPrefix + "-session_name-search-text-field") as HTMLInputElement;
                    const sessionNameValue = sessionNameField.value;

                    const newSearchEntry = {
                        search__stroke: strokeValue || undefined,
                        search__distance: distanceValue === -1 ? undefined : distanceValue,
                        search__competing_min_age: minAgeValue === -1 ? undefined : minAgeValue,
                        search__competing_max_age: maxAgeValue === -1 ? undefined : maxAgeValue,
                        search__competing_gender: genderValue || undefined,
                        search__stage: stageValue || undefined,
                        search__session_name: sessionNameValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "EVENT_OF_SESSION": {
                try {
                    const strokeField = document.getElementById(idPrefix + "-stroke-search-text-field") as HTMLInputElement;
                    const strokeValue = strokeField.value;

                    const distanceField = document.getElementById(idPrefix + "-distance-search-text-field") as HTMLInputElement;
                    const distanceValue = parseInt(distanceField.value || "-1");

                    const minAgeField = document.getElementById(idPrefix + "-minimum_age-search-text-field") as HTMLInputElement;
                    const minAgeValue = parseInt(minAgeField.value || "-1");

                    const maxAgeField = document.getElementById(idPrefix + "-maximum_age-search-text-field") as HTMLInputElement;
                    const maxAgeValue = parseInt(maxAgeField.value || "-1");

                    const genderField = document.getElementById(idPrefix + "-gender-search-text-field") as HTMLInputElement;
                    const genderValue = genderField.value;

                    const stageField = document.getElementById(idPrefix + "-stage-search-text-field") as HTMLInputElement;
                    const stageValue = stageField.value;

                    const newSearchEntry = {
                        search__stroke: strokeValue || undefined,
                        search__distance: distanceValue === -1 ? undefined : distanceValue,
                        search__competing_min_age: minAgeValue === -1 ? undefined : minAgeValue,
                        search__competing_max_age: maxAgeValue === -1 ? undefined : maxAgeValue,
                        search__competing_gender: genderValue || undefined,
                        search__stage: stageValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "INDIVIDUAL_ENTRY_OF_HEAT":
            case "INDIVIDUAL_ENTRY_OF_EVENT":
            case "SWIMMER_OF_MEET": {
                try {
                    const swimmerFirstNameField = document.getElementById(idPrefix + "-swimmer_first_name-search-text-field") as HTMLInputElement;
                    const swimmerFirstNameValue = swimmerFirstNameField.value;

                    const swimmerLastNameField = document.getElementById(idPrefix + "-swimmer_last_name-search-text-field") as HTMLInputElement;
                    const swimmerLastNameValue = swimmerLastNameField.value;

                    const ageField = document.getElementById(idPrefix + "-age-search-text-field") as HTMLInputElement;
                    const ageValue = parseInt(ageField.value || "-1");

                    const genderField = document.getElementById(idPrefix + "-gender-search-text-field") as HTMLInputElement;
                    const genderValue = genderField.value;

                    const teamNameField = document.getElementById(idPrefix + "-team_name-search-text-field") as HTMLInputElement;
                    const teamNameValue = teamNameField.value;

                    const teamAcronymField = document.getElementById(idPrefix + "-team_acronym-search-text-field") as HTMLInputElement;
                    const teamAcronymValue = teamAcronymField.value;

                    const newSearchEntry = {
                        search__first_name: swimmerFirstNameValue || undefined,
                        search__last_name: swimmerLastNameValue || undefined,
                        search__age: ageValue === -1 ? undefined : ageValue,
                        search__gender: genderValue || undefined,
                        search__team_name: teamNameValue || undefined,
                        search__team_acronym: teamAcronymValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "SWIMMER_OF_TEAM": {
                try {
                    const swimmerFirstNameField = document.getElementById(idPrefix + "-swimmer_first_name-search-text-field") as HTMLInputElement;
                    const swimmerFirstNameValue = swimmerFirstNameField.value;

                    const swimmerLastNameField = document.getElementById(idPrefix + "-swimmer_last_name-search-text-field") as HTMLInputElement;
                    const swimmerLastNameValue = swimmerLastNameField.value;

                    const ageField = document.getElementById(idPrefix + "-age-search-text-field") as HTMLInputElement;
                    const ageValue = parseInt(ageField.value || "-1");

                    const genderField = document.getElementById(idPrefix + "-gender-search-text-field") as HTMLInputElement;
                    const genderValue = genderField.value;

                    const newSearchEntry = {
                        search__first_name: swimmerFirstNameValue || undefined,
                        search__last_name: swimmerLastNameValue || undefined,
                        search__age: ageValue === -1 ? undefined : ageValue,
                        search__gender: genderValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "INDIVIDUAL_ENTRY_OF_TEAM": {
                try {
                    const eventStrokeField = document.getElementById(idPrefix + "-event-stroke-search-text-field") as HTMLInputElement;
                    const eventStrokeValue = eventStrokeField.value;

                    const eventDistanceField = document.getElementById(idPrefix + "-event-distance-search-text-field") as HTMLInputElement;
                    const eventDistanceValue = parseInt(eventDistanceField.value || "-1");

                    const eventMinAgeField = document.getElementById(idPrefix + "-event-minimum_age-search-text-field") as HTMLInputElement;
                    const eventMinAgeValue = parseInt(eventMinAgeField.value || "-1");

                    const eventMaxAgeField = document.getElementById(idPrefix + "-event-maximum_age-search-text-field") as HTMLInputElement;
                    const eventMaxAgeValue = parseInt(eventMaxAgeField.value || "-1");

                    const eventGenderField = document.getElementById(idPrefix + "-event-gender-search-text-field") as HTMLInputElement;
                    const eventGenderValue = eventGenderField.value;

                    const eventStageField = document.getElementById(idPrefix + "-event-stage-search-text-field") as HTMLInputElement;
                    const eventStageValue = eventStageField.value;

                    const eventSessionNameField = document.getElementById(idPrefix + "-event-session_name-search-text-field") as HTMLInputElement;
                    const eventSessionNameValue = eventSessionNameField.value;

                    const swimmerFirstNameField = document.getElementById(idPrefix + "-swimmer-first_name-search-text-field") as HTMLInputElement;
                    const swimmerFirstNameValue = swimmerFirstNameField.value;

                    const swimmerLastNameField = document.getElementById(idPrefix + "-swimmer-last_name-search-text-field") as HTMLInputElement;
                    const swimmerLastNameValue = swimmerLastNameField.value;

                    const swimmerAgeField = document.getElementById(idPrefix + "-swimmer-age-search-text-field") as HTMLInputElement;
                    const swimmerAgeValue = parseInt(swimmerAgeField.value || "-1");

                    const swimmerGenderField = document.getElementById(idPrefix + "-swimmer-gender-search-text-field") as HTMLInputElement;
                    const swimmerGenderValue = swimmerGenderField.value;

                    const newSearchEntry = {
                        search__event_stroke: eventStrokeValue || undefined,
                        search__event_distance: eventDistanceValue === -1 ? undefined : eventDistanceValue,
                        search__event_competing_min_age: eventMinAgeValue === -1 ? undefined : eventMinAgeValue,
                        search__event_competing_max_age: eventMaxAgeValue === -1 ? undefined : eventMaxAgeValue,
                        search__event_competing_gender: eventGenderValue || undefined,
                        search__event_stage: eventStageValue || undefined,
                        search__event_session_name: eventSessionNameValue || undefined,
                        search__swimmer_first_name: swimmerFirstNameValue || undefined,
                        search__swimmer_last_name: swimmerLastNameValue || undefined,
                        search__swimmer_age: swimmerAgeValue === -1 ? undefined : swimmerAgeValue,
                        search__swimmer_gender: swimmerGenderValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "RELAY_ENTRY_OF_TEAM":
            case "RELAY_ENTRY_OF_SWIMMER": {
                try {
                    const strokeField = document.getElementById(idPrefix + "-stroke-search-text-field") as HTMLInputElement;
                    const strokeValue = strokeField.value;

                    const distanceField = document.getElementById(idPrefix + "-distance-search-text-field") as HTMLInputElement;
                    const distanceValue = parseInt(distanceField.value || "-1");

                    const minAgeField = document.getElementById(idPrefix + "-minimum_age-search-text-field") as HTMLInputElement;
                    const minAgeValue = parseInt(minAgeField.value || "-1");

                    const maxAgeField = document.getElementById(idPrefix + "-maximum_age-search-text-field") as HTMLInputElement;
                    const maxAgeValue = parseInt(maxAgeField.value || "-1");

                    const genderField = document.getElementById(idPrefix + "-gender-search-text-field") as HTMLInputElement;
                    const genderValue = genderField.value;

                    const stageField = document.getElementById(idPrefix + "-stage-search-text-field") as HTMLInputElement;
                    const stageValue = stageField.value;

                    const sessionNameField = document.getElementById(idPrefix + "-session_name-search-text-field") as HTMLInputElement;
                    const sessionNameValue = sessionNameField.value;

                    const participantNamesField = document.getElementById(idPrefix + "-participant_first_names-search-text-field") as HTMLInputElement;
                    const participantNamesValue = participantNamesField.value;

                    const newSearchEntry = {
                        search__stroke: strokeValue || undefined,
                        search__distance: distanceValue === -1 ? undefined : distanceValue,
                        search__competing_min_age: minAgeValue === -1 ? undefined : minAgeValue,
                        search__competing_max_age: maxAgeValue === -1 ? undefined : maxAgeValue,
                        search__competing_gender: genderValue || undefined,
                        search__stage: stageValue || undefined,
                        search__session_name: sessionNameValue || undefined,
                        search__participant_names: participantNamesValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            case "RELAY_ENTRY_OF_HEAT":
            case "RELAY_ENTRY_OF_EVENT": {
                try {
                    const teamNameField = document.getElementById(idPrefix + "-team_name-search-text-field") as HTMLInputElement;
                    const teamNameValue = teamNameField.value;

                    const teamAcronymField = document.getElementById(idPrefix + "-team_acronym-search-text-field") as HTMLInputElement;
                    const teamAcronymValue = teamAcronymField.value;

                    const participantNamesField = document.getElementById(idPrefix + "-participant_first_names-search-text-field") as HTMLInputElement;
                    const participantNamesValue = participantNamesField.value;

                    const newSearchEntry = {
                        search__team_name: teamNameValue || undefined,
                        search__team_acronym: teamAcronymValue || undefined,
                        search__participant_names: participantNamesValue || undefined
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("/errors/unknown");
                }
                break;
            }

            // ! should never occur
            default:
                // ? invalid search type specification
                navigate("/errors/unknown");
        }
    }

    // * define initial data loader with useEffect
    useEffect(() => {
        handleLoadMore()
    }, [tableState.searchEntry]);

    return (
        <>
            <div className="flex flex-col gap-y-2">
                <div className="flex flex-row gap-x-2 justify-between items-end">
                    <FilterForm type={searchType} idPrefix={idPrefix} handleSearch={handleSearchSubmit} />
                    <div className="flex flex-col gap-y-2 items-end flex-shrink-0">
                        {tableBarItems}
                        {isMeetHost && tableBarHostItems}
                    </div>
                </div>
            </div>
            <TableGrid>
                <colgroup>
                    {tableCols}
                    <col span={1} className="w-7" />
                </colgroup>

                <TableHeader isOpen={tableShown} handleClick={() => setTableShown(!tableShown)} entries={tableHeaderTitles} />
                {tableShown && tableState.data.map(tableRowGenerator)}
            </TableGrid>
            {tableState.data.length === 0 && tableShown
                && <tr>
                    <td className="flex flex-row justify-center" colSpan={tableCols.length + 1}>
                        <MainContentText>
                            {noneFoundText}
                        </MainContentText>
                    </td>
                </tr>
            }
            {!tableState.loadedAllData &&
                <div className="flex flex-row justify-center">
                    <PageButton color="yellow" text={loadMoreText} icon="LIST_DOWN" handleClick={handleLoadMore} />
                </div>
            }
        </>
    )
}