import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { TeamContext } from "../../pages/teams/TeamPage.tsx";
import { Team, Swimmer } from "../../utilities/helpers/modelTypes.ts";
import { generateSwimmerName } from "../../utilities/helpers/nameGenerators.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function TeamSwimmersTable() {
    // * initialize context, state, and navigation
    const { teamData, isMeetHost }: {teamData: Team, isMeetHost: boolean} = useContext(TeamContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (teamData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: Swimmer) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${teamData.fields.meet.pk}/swimmers/${item.pk}`)} entries={[
                generateSwimmerName(item),
                `${item.fields.age}`,
                item.fields.gender,
            ]} />
        )
    }

    return (
        <DataTable
            apiRoute="/api/v1/swimmers/"
            queryParams={{
                specific_to: "team",
                team_id: teamData.pk
            }}
            searchType="SWIMMER_OF_TEAM"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create a swimmer" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${teamData.fields.meet.pk}/swimmers/create`)} />
            ]}
            tableCols={[
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />
            ]}
            tableHeaderTitles={[
                "Name", "Age", "Gender"
            ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no swimmers were found."
            loadMoreText="Load more swimmers"
            isMeetHost={isMeetHost}
        />
    )
}