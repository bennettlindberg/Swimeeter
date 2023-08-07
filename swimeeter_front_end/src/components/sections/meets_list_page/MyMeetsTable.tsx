import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext, UserState } from "../../../App.tsx";
import { Meet } from "../../utilities/types/modelTypes.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function MyMeetsTable() {
    // * initialize context, state, and navigation
    const { userState }: { userState: UserState } = useContext(AppContext);
    const navigate = useNavigate();

    // * define table row generator
    function tableRowGenerator(item: Meet) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${item.pk}`)} entries={[
                item.fields.name,
                item.fields.begin_time?.toDateString() || "N/A",
                item.fields.end_time?.toDateString() || "N/A",
                item.fields.is_public ? "Public" : "Private"
            ]} />
        )
    }

    return (
        <DataTable
            apiRoute="/api/v1/meets/"
            queryParams={{
                specific_to: "host",
                host_id: userState.profile?.id
            }}
            searchInfo={{
                title: "MEET SEARCH",
                description: "The meet search field can be used to search for meets by their name. Type a name into the search field and click the search button to filter the meets listed in the table below."
            }}
            searchType="MEET"
            tableBarItems={[
                <PageButton color="orange" text="Create a meet" icon="CIRCLE_PLUS" handleClick={() => navigate("/meets/create")} />
            ]}
            tableBarHostItems={[]}
            tableCols={[
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />
            ]}
            tableHeaderTitles={[
                "Name", "Begin Time", "End Time", "Visibility"
            ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no meets were found."
            isMeetHost={true}
        />
    )
}