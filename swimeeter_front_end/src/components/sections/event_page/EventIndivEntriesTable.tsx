import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { EventContext } from "../../pages/events/EventPage.tsx";
import { Event, IndividualEntry } from "../../utilities/helpers/modelTypes.ts";
import { generateSwimmerName } from "../../utilities/helpers/nameGenerators.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function EventIndivEntriesTable() {
    // * initialize context, state, and navigation
    const { eventData, isMeetHost }: {eventData: Event, isMeetHost: boolean} = useContext(EventContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (eventData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: IndividualEntry) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${eventData.fields.session.fields.meet}/individual_entries/${item.pk}`)} entries={[
                generateSwimmerName(item.fields.swimmer),
                `${item.fields.swimmer.fields.age}`,
                item.fields.swimmer.fields.gender,
                item.fields.swimmer.fields.team.fields.name
            ]} />
        )
    }

    return (
        <DataTable
            apiRoute="/api/v1/individual_entries/"
            queryParams={{
                specific_to: "event",
                event_id: eventData.pk
            }}
            searchType="INDIVIDUAL_ENTRY_OF_EVENT"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create an indiv. entry" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${eventData.fields.session.fields.meet}/individual_entries/create`)} />
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
            noneFoundText="Sorry, no individual entries were found."
            loadMoreText="Load more individual entries"
            isMeetHost={isMeetHost}
        />
    )
}