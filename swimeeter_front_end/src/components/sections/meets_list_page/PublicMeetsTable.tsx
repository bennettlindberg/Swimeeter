import { useId, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Meet } from "../../utilities/types/modelTypes.ts";

import { TableGrid } from "../../utilities/tables/TableGrid.tsx";
import { TableHeader } from "../../utilities/tables/TableHeader.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";

import { PageButton } from "../../utilities/general/PageButton.tsx";
import { InfoPane } from "../../utilities/forms/InfoPane.tsx";
import { IconButton } from "../../utilities/general/IconButton.tsx";
import { SearchButton } from "../../utilities/tables/SearchButton.tsx";
import { SearchField } from "../../utilities/tables/SearchField.tsx";

type TableState = {
    nextToLoad: number,
    loadedAllData: boolean,
    searchEntry: string,
    data: {
        meet: Meet,
        id: number
    }[]
}

type TableAction = {
    type: "LOADED_ALL_DATA"
} | {
    type: "NEW_BATCH_RETRIEVED"
    data: {
        meet: Meet,
        id: number
    }[]
} | {
    type: "NEW_SEARCH_ENTRY",
    searchEntry: string
}

function tableReducer(state: TableState, action: TableAction) {
    switch (action.type) {
        case "NEW_BATCH_RETRIEVED":
            return {
                ...state,
                nextToLoad: state.nextToLoad + 10,
                data: {
                    ...state.data,
                    ...action.data
                }
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
export function PublicMeetsTable() {
    // * initialize navigation and id
    const navigate = useNavigate();
    const idPrefix = useId();

    // * initialize state
    const [tableShown, setTableShown] = useState<boolean>(true);
    const [searchInfoShown, setSearchInfoShown] = useState<boolean>(false);
    const [tableState, tableDispatch] = useReducer(tableReducer, {
        nextToLoad: 0,
        loadedAllData: false,
        searchEntry: "",
        data: []
    });

    // * define load more data handler
    async function handleLoadMore() {
        if (tableState.loadedAllData) {
            return;
        }

        // @ make request to back-end for next data batch
        try {
            const response = await axios.get('/api/v1/meets/', {
                params: {
                    "specific_to": "all",
                    "lower_bound": tableState.nextToLoad,
                    "upper_bound": tableState.nextToLoad + 10,
                    "filter_value": tableState.searchEntry === "" ? undefined : tableState.searchEntry
                }
            });

            const newMeets: {
                meet: Meet, id: number
            }[] = [];

            for (const meetJSON of response.data as {
                model: string, pk: number, fields: Meet
            }[]) {
                newMeets.push({
                    meet: meetJSON.fields, id: meetJSON.pk
                });
            }

            tableDispatch({
                type: "NEW_BATCH_RETRIEVED",
                data: newMeets
            });

            if (newMeets.length < 10) {
                tableDispatch({
                    type: "LOADED_ALL_DATA"
                });
            }
        } catch (error) {
            // ? back-end error
            // ! unhandled
        }
    }

    // * define search submit handler
    function handleSearchSubmit() {
        const searchField = document.getElementById(idPrefix + "-search-field") as HTMLInputElement;
        const searchValue = searchField.value;

        tableDispatch({
            type: "NEW_SEARCH_ENTRY",
            searchEntry: searchValue || ""
        });
    }

    return (
        <>
            <div className="flex flex-row gap-x-2 ">
                {searchInfoShown && <InfoPane info={{
                    title: "MEET SEARCH",
                    description: "The meet search field can be used to search for meets by their name. Type a name into the search field and click the search button to filter the meets listed in the table below."
                }} handleXClick={() => setSearchInfoShown(false)} />}
                <SearchField placeholderText="Search meets..." idPrefix={idPrefix} handleReturn={handleSearchSubmit} />
                <SearchButton handleClick={handleSearchSubmit} />
                <IconButton color="primary" icon="CIRCLE_INFO" handleClick={() => setSearchInfoShown(!searchInfoShown)} />
                <div className="flex-auto"></div>
                <PageButton color="orange" text="Create a meet" icon="CIRCLE_PLUS" handleClick={() => navigate("/meets/create")} />
            </div>
            <TableGrid>
                <colgroup>
                    <col span={1} className="w-auto" />
                    <col span={1} className="w-auto" />
                    <col span={1} className="w-auto" />
                    <col span={1} className="w-auto" />
                    <col span={1} className="w-7" />
                </colgroup>

                <TableHeader isOpen={tableShown} handleClick={() => setTableShown(!tableShown)} entries={[
                    "Name", "Begin Time", "End Time", "Host"
                ]} />
                {
                    tableState.data.map(meetIDPair => (
                        <TableRow handleClick={() => navigate(`/meets/${meetIDPair.id}`)} entries={[
                            meetIDPair.meet.name,
                            meetIDPair.meet.begin_time?.toDateString() || "N/A",
                            meetIDPair.meet.end_time?.toDateString() || "N/A",
                            `${meetIDPair.meet.host.last_name}, ${meetIDPair.meet.host.first_name}`
                        ]} />
                    ))
                }
            </TableGrid>
            {!tableState.loadedAllData && <PageButton color="primary" text="Load more meets" icon="EARTH_GLOBE" handleClick={handleLoadMore} />}
        </>
    )
}