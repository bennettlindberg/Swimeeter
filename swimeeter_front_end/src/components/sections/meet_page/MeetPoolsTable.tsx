import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { MeetContext } from "../../pages/meets/MeetPage.tsx";
import { Meet, Pool } from "../../utilities/helpers/modelTypes.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function MeetPoolsTable() {
    // * initialize context, state, and navigation
    const { meetData, isMeetHost }: {meetData: Meet, isMeetHost: boolean} = useContext(MeetContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (meetData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: Pool) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${meetData.pk}/pools/${item.pk}`)} entries={[
                item.fields.name,
                `${item.fields.lanes}`,
                `${item.fields.side_length}`,
                item.fields.measure_unit
            ]} />
        )
    }

    return (
        <DataTable
            apiRoute="/api/v1/pools/"
            queryParams={{
                specific_to: "meet",
                meet_id: meetData.pk
            }}
            searchType="POOL_OF_MEET"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create a pool" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${meetData.pk}/pools/create`)} />
            ]}
            tableCols={[
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />
            ]}
            tableHeaderTitles={[
                "Name", "Lanes", "Length", "Units"
            ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no pools were found."
            isMeetHost={isMeetHost}
        />
    )
}