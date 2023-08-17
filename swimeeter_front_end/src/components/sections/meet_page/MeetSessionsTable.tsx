import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { MeetContext } from "../../pages/meets/MeetPage.tsx";
import { Meet, Session } from "../../utilities/helpers/modelTypes.ts";
import { generateLocalTimeString } from "../../utilities/helpers/nameGenerators.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function MeetSessionsTable() {
    // * initialize context, state, and navigation
    const { meetData, isMeetHost }: {meetData: Meet, isMeetHost: boolean} = useContext(MeetContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (meetData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: Session) {
        let begin_time = "N/A";
        if (item.fields.begin_time) {
            begin_time = generateLocalTimeString(item.fields.begin_time);
        }

        let end_time = "N/A";
        if (item.fields.end_time) {
            end_time = generateLocalTimeString(item.fields.end_time);
        }

        return <TableRow handleClick={() => navigate(`/meets/${meetData.pk}/sessions/${item.pk}`)} entries={[
            item.fields.name,
            begin_time,
            end_time,
            item.fields.pool.fields.name
        ]} />
    }

    return (
        <DataTable
            apiRoute="/api/v1/sessions/"
            queryParams={{
                specific_to: "meet",
                meet_id: meetData.pk
            }}
            searchType="SESSION_OF_MEET"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create a session" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${meetData.pk}/sessions/create`)} />
            ]}
            tableCols={[
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />
            ]}
            tableHeaderTitles={[
                "Name", "Begin Time", "End Time", "Pool"
            ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no session were found."
            loadMoreText="Load more sessions"
            isMeetHost={isMeetHost}
        />
    )
}