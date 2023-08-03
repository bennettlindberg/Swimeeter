import { useEffect, useId, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Host, Meet } from "../../utilities/types/modelTypes.ts";

import { TableGrid } from "../../utilities/tables/TableGrid.tsx";
import { TableHeader } from "../../utilities/tables/TableHeader.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";

import { PageButton } from "../../utilities/general/PageButton.tsx";
import { InfoPane } from "../../utilities/forms/InfoPane.tsx";
import { IconButton } from "../../utilities/general/IconButton.tsx";
import { SearchField } from "../../utilities/tables/SearchField.tsx";
import { MainContentText } from "../../utilities/main_content/MainContentText.tsx";

type TableState = {
    nextToLoad: number,
    loadedAllData: boolean,
    searchEntry: string,
    data: Meet[]
}

type TableAction = {
    type: "LOADED_ALL_DATA"
} | {
    type: "NEW_BATCH_RETRIEVED"
    data: Meet[]
} | {
    type: "NEW_SEARCH_ENTRY",
    searchEntry: string
}

function tableReducer(state: TableState, action: TableAction) {
    console.log(action)
    console.log(state)

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
                    "filter_value": tableState.searchEntry
                }
            });

            const newMeets: Meet[] = [];

            for (const meetJSON of response.data) {
                newMeets.push(meetJSON);
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

        if (searchValue !== tableState.searchEntry) {
            tableDispatch({
                type: "NEW_SEARCH_ENTRY",
                searchEntry: searchValue || ""
            });
        }
    }

    // * define initial data loader with useEffect
    useEffect(() => {
        handleLoadMore()
    }, [tableState.searchEntry]);

    // * define host name generator
    function generateHostName(host: Host) {
        let accountName = "";

        if (host.fields.prefix !== "") {
            accountName += host.fields.prefix + " ";
        }

        accountName += host.fields.first_name + " ";

        if (host.fields.middle_initials !== "") {
            accountName += host.fields.middle_initials + " ";
        }

        accountName += host.fields.last_name;

        if (host.fields.suffix !== "") {
            accountName += " " + host.fields.suffix;
        }

        return accountName;
    }

    return (
        <>
            <div className="flex flex-col gap-y-2">
                {searchInfoShown && <InfoPane info={{
                    title: "MEET SEARCH",
                    description: "The meet search field can be used to search for meets by their name. Type a name into the search field and click the search button to filter the meets listed in the table below."
                }} handleXClick={() => setSearchInfoShown(false)} />}
                <div className="flex flex-row gap-x-2 items-end">
                    <SearchField placeholderText="Search meets..." idPrefix={idPrefix} handleSearch={handleSearchSubmit} />
                    <IconButton color="primary" icon="CIRCLE_INFO" handleClick={() => setSearchInfoShown(!searchInfoShown)} />
                    <div className="flex-auto"></div>
                    <PageButton color="orange" text="Create a meet" icon="CIRCLE_PLUS" handleClick={() => navigate("/meets/create", { replace: true })} />
                </div>
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
                {tableShown && tableState.data.map(meet => (
                    <TableRow handleClick={() => navigate(`/meets/${meet.pk}`)} entries={[
                        meet.fields.name,
                        meet.fields.begin_time?.toDateString() || "N/A",
                        meet.fields.end_time?.toDateString() || "N/A",
                        generateHostName(meet.fields.host)
                    ]} />
                ))}
            </TableGrid>
            {tableState.data.length === 0 && tableShown
                && <tr>
                    <td className="flex flex-row justify-center" colSpan={4}>
                        <MainContentText>
                            Sorry, no meets were found.
                        </MainContentText>
                    </td>
                </tr>
            }
            {!tableState.loadedAllData && 
                <div className="flex flex-row justify-center">
                    <PageButton color="yellow" text="Load more meets" icon="EARTH_GLOBE" handleClick={handleLoadMore} />
                </div>
            }
        </>
    )
}