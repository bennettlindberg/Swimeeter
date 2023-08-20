import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { TeamContext } from "../../pages/teams/TeamPage.tsx";
import { Team, RelayEntry } from "../../utilities/helpers/modelTypes.ts";
import { generateRelayParticipantNames } from "../../utilities/helpers/nameGenerators.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function TeamRelayEntriesTable() {
    // * initialize context, state, and navigation
    const { teamData, isMeetHost }: {teamData: Team, isMeetHost: boolean} = useContext(TeamContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (teamData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: RelayEntry) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${teamData.fields.meet.pk}/relay_entries/${item.pk}`)} entries={[
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
                specific_to: "team",
                team_id: teamData.pk
            }}
            searchType="RELAY_ENTRY_OF_TEAM"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create an relay entry" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${teamData.fields.meet.pk}/relay_entries/create`)} />
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