import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { SwimmerContext } from "../../pages/swimmers/SwimmerPage.tsx";
import { Swimmer, RelayEntry } from "../../utilities/helpers/modelTypes.ts";
import { generateRelayParticipantNames } from "../../utilities/helpers/nameGenerators.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function SwimmerRelayEntriesTable() {
    // * initialize context, state, and navigation
    const { swimmerData, isMeetHost }: {swimmerData: Swimmer, isMeetHost: boolean} = useContext(SwimmerContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (swimmerData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: RelayEntry) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${swimmerData.fields.meet.pk}/relay_entries/${item.pk}`)} entries={[
                generateRelayParticipantNames(item),
                `${item.fields.event.fields.distance}`,
                item.fields.event.fields.stroke
            ]} />
        )
    }

    return (
        <DataTable
            apiRoute="/api/v1/relay_entries/"
            queryParams={{
                specific_to: "swimmer",
                swimmer_id: swimmerData.pk
            }}
            searchType="RELAY_ENTRY_OF_SWIMMER"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create an relay entry" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${swimmerData.fields.meet.pk}/relay_entries/create`)} />
            ]}
            tableCols={[
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />
            ]}
            tableHeaderTitles={[
                "Participants", "Distance", "Stroke"
            ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no relay entries were found."
            loadMoreText="Load more relay entries"
            isMeetHost={isMeetHost}
        />
    )
}