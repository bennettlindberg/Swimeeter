import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { SwimmerContext } from "../../pages/swimmers/SwimmerPage.tsx";
import { Swimmer, IndividualEntry } from "../../utilities/helpers/modelTypes.ts";
import { generateCompetitorsString } from "../../utilities/helpers/nameGenerators.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function SwimmerIndivEntriesTable() {
    // * initialize context, state, and navigation
    const { swimmerData, isMeetHost }: {swimmerData: Swimmer, isMeetHost: boolean} = useContext(SwimmerContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (swimmerData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: IndividualEntry) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${swimmerData.fields.meet.pk}/individual_entries/${item.pk}`)} entries={[
                `${item.fields.event.fields.distance}`,
                item.fields.event.fields.stroke,
                generateCompetitorsString(item.fields.event.fields.competing_gender, item.fields.event.fields.competing_min_age, item.fields.event.fields.competing_max_age),
                item.fields.event.fields.stage
            ]} />
        )
    }

    return (
        <DataTable
            apiRoute="/api/v1/individual_entries/"
            queryParams={{
                specific_to: "swimmer",
                swimmer_id: swimmerData.pk
            }}
            searchType="INDIVIDUAL_ENTRY_OF_SWIMMER"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create an indiv. entry" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${swimmerData.fields.meet.pk}/individual_entries/create`)} />
            ]}
            tableCols={[
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />
            ]}
            tableHeaderTitles={[
                "Distance", "Stroke", "Competitors", "Stage"
            ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no individual entries were found."
            loadMoreText="Load more individual entries"
            isMeetHost={isMeetHost}
        />
    )
}