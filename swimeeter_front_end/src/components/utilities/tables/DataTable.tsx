import { useEffect, useId, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { TableGrid } from "../../utilities/tables/TableGrid.tsx";
import { TableHeader } from "../../utilities/tables/TableHeader.tsx";

import { PageButton } from "../../utilities/general/PageButton.tsx";
import { InfoPane } from "../../utilities/forms/InfoPane.tsx";
import { IconButton } from "../../utilities/general/IconButton.tsx";
import { SearchField } from "../../utilities/tables/SearchField.tsx";
import { MainContentText } from "../../utilities/main_content/MainContentText.tsx";
import { InfoType } from "../forms/formTypes.ts";

type TableState = {
    nextToLoad: number,
    loadedAllData: boolean,
    searchEntry: string,
    data: any[]
}

type TableAction = {
    type: "LOADED_ALL_DATA"
} | {
    type: "NEW_BATCH_RETRIEVED"
    data: any[]
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
    searchPlaceholder,
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
    searchPlaceholder: string,
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
            const response = await axios.get(apiRoute, {
                params: {
                    ...queryParams,
                    lower_bound: tableState.nextToLoad,
                    upper_bound: tableState.nextToLoad + 10,
                    filter_value: tableState.searchEntry
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

    return (
        <>
            <div className="flex flex-col gap-y-2">
                {searchInfoShown && <InfoPane info={searchInfo} handleXClick={() => setSearchInfoShown(false)} />}
                <div className="flex flex-row gap-x-2 items-end">
                    <SearchField placeholderText={searchPlaceholder} idPrefix={idPrefix} handleSearch={handleSearchSubmit} />
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
                    <PageButton color="yellow" text="Load more meets" icon="EARTH_GLOBE" handleClick={handleLoadMore} />
                </div>
            }
        </>
    )
}