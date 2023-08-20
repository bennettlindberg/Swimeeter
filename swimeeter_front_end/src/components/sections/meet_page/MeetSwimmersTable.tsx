import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { MeetContext } from "../../pages/meets/MeetPage.tsx";
import { Meet, Swimmer } from "../../utilities/helpers/modelTypes.ts";
import { generateSwimmerName } from "../../utilities/helpers/nameGenerators.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function MeetSwimmersTable() {
    // * initialize context, state, and navigation
    const { meetData, isMeetHost }: {meetData: Meet, isMeetHost: boolean} = useContext(MeetContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (meetData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: Swimmer) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${meetData.pk}/swimmers/${item.pk}`)} entries={[
                generateSwimmerName(item),
                `${item.fields.age}`,
                item.fields.gender,
                item.fields.team.fields.name
            ]} />
        )
    }

    return (
        <DataTable
            apiRoute="/api/v1/swimmers/"
            queryParams={{
                specific_to: "meet",
                meet_id: meetData.pk
            }}
            searchType="SWIMMER_OF_MEET"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create a swimmer" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${meetData.pk}/swimmers/create`)} />
            ]}
            tableCols={[
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />
            ]}
            tableHeaderTitles={[
                "Name", "Age", "Gender", "Team"
            ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no swimmers were found."
            loadMoreText="Load more swimmers"
            isMeetHost={isMeetHost}
        />
    )
}