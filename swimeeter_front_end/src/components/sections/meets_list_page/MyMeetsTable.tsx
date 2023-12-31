import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext, UserState } from "../../../App.tsx";
import { Meet } from "../../utilities/helpers/modelTypes.ts";
import { generateLocalTimeString } from "../../utilities/helpers/nameGenerators.ts";

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
        let begin_time = "N/A";
        if (item.fields.begin_time) {
            begin_time = generateLocalTimeString(item.fields.begin_time);
        }

        let end_time = "N/A";
        if (item.fields.end_time) {
            end_time = generateLocalTimeString(item.fields.end_time);
        }

        return (
            <TableRow handleClick={() => navigate(`/meets/${item.pk}`)} entries={[
                item.fields.name,
                begin_time,
                end_time,
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
            searchType="MEET_OF_HOST"
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
            loadMoreText="Load more meets"
            isMeetHost={true}
        />
    )
}