import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { TeamContext } from "../../pages/teams/TeamPage.tsx";
import { Team, IndividualEntry } from "../../utilities/helpers/modelTypes.ts";
import { generateEventName, generateSeedTimeString, generateSwimmerName } from "../../utilities/helpers/nameGenerators.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function TeamIndivEntriesTable() {
    // * initialize context, state, and navigation
    const { teamData, isMeetHost }: {teamData: Team, isMeetHost: boolean} = useContext(TeamContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (teamData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: IndividualEntry) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${teamData.fields.meet.pk}/individual_entries/${item.pk}`)} entries={[
                generateEventName(item.fields.event),
                generateSwimmerName(item.fields.swimmer),
                "" + (item.fields.heat_number || "N/A"),
                "" + (item.fields.lane_number || "N/A"),
                generateSeedTimeString(item.fields.seed_time)
            ]} />
        )
    }

    return (
        <DataTable
            apiRoute="/api/v1/individual_entries/"
            queryParams={{
                specific_to: "team",
                team_id: teamData.pk
            }}
            searchType="INDIVIDUAL_ENTRY_OF_TEAM"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create an indiv. entry" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${teamData.fields.meet.pk}/individual_entries/create`)} />
            ]}
            tableCols={[
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />
            ]}
            tableHeaderTitles={[
                "Event", "Swimmer", "Heat", "Lane", "Seed Time"
            ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no individual entries were found."
            loadMoreText="Load more individual entries"
            isMeetHost={isMeetHost}
        />
    )
}