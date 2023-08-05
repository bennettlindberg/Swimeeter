import { useEffect, useId, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { TableGrid } from "../../utilities/tables/TableGrid.tsx";
import { TableHeader } from "../../utilities/tables/TableHeader.tsx";

import { PageButton } from "../../utilities/general/PageButton.tsx";
import { InfoPane } from "../../utilities/forms/InfoPane.tsx";
import { IconButton } from "../../utilities/general/IconButton.tsx";
import { SearchField } from "./SearchField.tsx";
import { MainContentText } from "../../utilities/main_content/MainContentText.tsx";
import { InfoType } from "../forms/formTypes.ts";

type TableState = {
    nextToLoad: number,
    loadedAllData: boolean,
    searchEntry: {[key: string]: any},
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
    searchInfo,
    searchType,
    tableBarItems,
    tableBarHostItems,
    tableCols,
    tableHeaderTitles,
    tableRowGenerator,
    noneFoundText,
    isMeetHost
}: {
    apiRoute: string,
    queryParams: Object,
    searchInfo: InfoType,
    searchType: "MEET" | "SESSION" | "POOL" | "TEAM" | "EVENT" | "SWIMMER"
    | "INDIVIDUAL_ENTRY_OF_SWIMMER" | "INDIVIDUAL_ENTRY_OF_EVENT"
    | "RELAY_ENTRY_OF_SWIMMER" | "RELAY_ENTRY_OF_EVENT"
    tableBarItems: JSX.Element[],
    tableBarHostItems: JSX.Element[],
    tableCols: JSX.Element[],
    tableHeaderTitles: string[],
    tableRowGenerator: (x: any) => JSX.Element,
    noneFoundText: string,
    isMeetHost: boolean
}) {
    // * initialize navigation, and id
    const navigate = useNavigate();
    const idPrefix = useId();

    // * initialize state
    const [tableShown, setTableShown] = useState<boolean>(true);
    const [searchInfoShown, setSearchInfoShown] = useState<boolean>(false);
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
            navigate("errors/unknown");
        }
    }

    // * define new search validator
    function validateNewSearch(newSearchEntry: {[key: string]: any}, oldSearchEntry: {[key: string]: any}) {
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
            case "MEET":
            case "SESSION": {
                try {
                    const nameField = document.getElementById(idPrefix + "-name-search-field") as HTMLInputElement;
                    const nameValue = nameField.value;

                    const newSearchEntry = {
                        search__name: nameValue
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("errors/unknown");
                }
                break;
            }

            case "POOL": {
                try {
                    const nameField = document.getElementById(idPrefix + "-name-search-field") as HTMLInputElement;
                    const nameValue = nameField.value;

                    const lanesField = document.getElementById(idPrefix + "-lanes-search-field") as HTMLInputElement;
                    const lanesValue = parseInt(lanesField.value);

                    const lengthField = document.getElementById(idPrefix + "-length-search-field") as HTMLInputElement;
                    const lengthValue = parseInt(lengthField.value);

                    const unitsField = document.getElementById(idPrefix + "-units-search-field") as HTMLInputElement;
                    const unitsValue = unitsField.value;

                    const newSearchEntry = {
                        search__name: nameValue,
                        search__lanes: lanesValue,
                        search__side_length: lengthValue,
                        search__measure_unit: unitsValue
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("errors/unknown");
                }
                break;
            }

            case "TEAM": {
                try {
                    const nameField = document.getElementById(idPrefix + "-name-search-field") as HTMLInputElement;
                    const nameValue = nameField.value;

                    const acronymField = document.getElementById(idPrefix + "-acronym-search-field") as HTMLInputElement;
                    const acronymValue = acronymField.value;

                    const newSearchEntry = {
                        search__name: nameValue,
                        search__acronym: acronymValue
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("errors/unknown");
                }
                break;
            }

            case "EVENT": {
                try {
                    const strokeField = document.getElementById(idPrefix + "-stroke-search-field") as HTMLInputElement;
                    const strokeValue = strokeField.value;

                    const distanceField = document.getElementById(idPrefix + "-distance-search-field") as HTMLInputElement;
                    const distanceValue = parseInt(distanceField.value);

                    const minAgeField = document.getElementById(idPrefix + "-min_age-search-field") as HTMLInputElement;
                    const minAgeValue = parseInt(minAgeField.value);

                    const maxAgeField = document.getElementById(idPrefix + "-max_age-search-field") as HTMLInputElement;
                    const maxAgeValue = parseInt(maxAgeField.value);

                    const genderField = document.getElementById(idPrefix + "-gender-search-field") as HTMLInputElement;
                    const genderValue = genderField.value;

                    const newSearchEntry = {
                        search__stroke: strokeValue,
                        search__distance: distanceValue,
                        search__competing_min_age: minAgeValue,
                        search__competing_max_age: maxAgeValue,
                        search__competing_gender: genderValue
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("errors/unknown");
                }
                break;
            }

            case "SWIMMER": {
                try {
                    const firstNameField = document.getElementById(idPrefix + "-first_name-search-field") as HTMLInputElement;
                    const firstNameValue = firstNameField.value;

                    const lastNameField = document.getElementById(idPrefix + "-last_name-search-field") as HTMLInputElement;
                    const lastNameValue = lastNameField.value;

                    const ageField = document.getElementById(idPrefix + "-age-search-field") as HTMLInputElement;
                    const ageValue = parseInt(ageField.value);

                    const genderField = document.getElementById(idPrefix + "-gender-search-field") as HTMLInputElement;
                    const genderValue = genderField.value;

                    const newSearchEntry = {
                        search__first_name: firstNameValue,
                        search__last_name: lastNameValue,
                        search__age: ageValue,
                        search__gender: genderValue
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("errors/unknown");
                }
                break;
            }

            case "INDIVIDUAL_ENTRY_OF_SWIMMER": {
                try {
                    const strokeField = document.getElementById(idPrefix + "-stroke-search-field") as HTMLInputElement;
                    const strokeValue = strokeField.value;

                    const distanceField = document.getElementById(idPrefix + "-distance-search-field") as HTMLInputElement;
                    const distanceValue = parseInt(distanceField.value);

                    const newSearchEntry = {
                        search__stroke: strokeValue,
                        search__distance: distanceValue
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("errors/unknown");
                }
                break;
            }

            case "INDIVIDUAL_ENTRY_OF_EVENT": {
                try {
                    const firstNameField = document.getElementById(idPrefix + "-first_name-search-field") as HTMLInputElement;
                    const firstNameValue = firstNameField.value;

                    const lastNameField = document.getElementById(idPrefix + "-last_name-search-field") as HTMLInputElement;
                    const lastNameValue = lastNameField.value;

                    const newSearchEntry = {
                        search__first_name: firstNameValue,
                        search__last_name: lastNameValue
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("errors/unknown");
                }
                break;
            }

            case "RELAY_ENTRY_OF_SWIMMER": {
                try {
                    const strokeField = document.getElementById(idPrefix + "-stroke-search-field") as HTMLInputElement;
                    const strokeValue = strokeField.value;

                    const distanceField = document.getElementById(idPrefix + "-distance-search-field") as HTMLInputElement;
                    const distanceValue = parseInt(distanceField.value);

                    const teamNamesField = document.getElementById(idPrefix + "-team_names-search-field") as HTMLInputElement;
                    const teamNamesValue = teamNamesField.value;

                    const newSearchEntry = {
                        search__stroke: strokeValue,
                        search__distance: distanceValue,
                        search__team_names: teamNamesValue
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("errors/unknown");
                }
                break;
            }

            case "RELAY_ENTRY_OF_EVENT": {
                try {
                    const teamNamesField = document.getElementById(idPrefix + "-team_names-search-field") as HTMLInputElement;
                    const teamNamesValue = teamNamesField.value;

                    const newSearchEntry = {
                        search__team_names: teamNamesValue
                    }

                    if (validateNewSearch(newSearchEntry, tableState.searchEntry)) {
                        tableDispatch({
                            type: "NEW_SEARCH_ENTRY",
                            searchEntry: newSearchEntry
                        });
                    }
                } catch {
                    // ? error retrieving search inputs
                    navigate("errors/unknown");
                }
                break;
            }

            // ! should never occur
            default:
                // ? error retrieving search inputs
                navigate("errors/unknown");
        }
    }

    // * define initial data loader with useEffect
    useEffect(() => {
        handleLoadMore()
    }, [tableState.searchEntry]);

    return (
        <>
            <div className="flex flex-col gap-y-2">
                {searchInfoShown && <InfoPane info={searchInfo} handleXClick={() => setSearchInfoShown(false)} />}
                <div className="flex flex-row gap-x-2 items-end">
                    <SearchField type={searchType} idPrefix={idPrefix} handleSearch={handleSearchSubmit} />
                    <IconButton color="primary" icon="CIRCLE_INFO" handleClick={() => setSearchInfoShown(!searchInfoShown)} />
                    <div className="flex-auto"></div>
                    {tableBarItems}
                    {isMeetHost && tableBarHostItems}
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
                    <PageButton color="yellow" text="Load more meets" icon="LIST_DOWN" handleClick={handleLoadMore} />
                </div>
            }
        </>
    )
}