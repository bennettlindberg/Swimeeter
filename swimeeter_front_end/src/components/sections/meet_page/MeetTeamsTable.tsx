import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { MeetContext } from "../../pages/meets/MeetPage.tsx";
import { Meet, Team } from "../../utilities/types/modelTypes.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function MeetTeamsTable() {
    // * initialize context, state, and navigation
    const { meetData, isMeetHost }: {meetData: Meet, isMeetHost: boolean} = useContext(MeetContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (meetData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: Team) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${meetData.pk}/teams/${item.pk}`)} entries={[
                item.fields.name,
                item.fields.acronym
            ]} />
        )
    }

    return (
        <DataTable
            apiRoute="/api/v1/teams/"
            queryParams={{
                specific_to: "meet",
                meet_id: meetData.pk
            }}
            searchInfo={{
                title: "TEAM SEARCH",
                description: "The team search field can be used to search for teams by their name and acronym.",
                permitted_values: "Any search string is allowed."
            }}
            searchType="TEAM"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create a team" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${meetData.pk}/teams/create`)} />
            ]}
            tableCols={[
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />
            ]}
            tableHeaderTitles={[
                "Name", "Acronym"
            ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no teams were found."
            isMeetHost={isMeetHost}
        />
    )
}