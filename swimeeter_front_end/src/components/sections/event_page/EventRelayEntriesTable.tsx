import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { EventContext } from "../../pages/events/EventPage.tsx";
import { Event, RelayEntry } from "../../utilities/helpers/modelTypes.ts";
import { generateRelayParticipantNames, generateSeedTimeString } from "../../utilities/helpers/nameGenerators.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function EventRelayEntriesTable() {
    // * initialize context, state, and navigation
    const { eventData, isMeetHost }: {eventData: Event, isMeetHost: boolean} = useContext(EventContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (eventData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: RelayEntry) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${eventData.fields.session.fields.meet}/relay_entries/${item.pk}`)} entries={[
                generateRelayParticipantNames(item),
                item.fields.relay_assignments[0].fields.swimmer.fields.team.fields.name,
                "" + (item.fields.heat_number || "N/A"),
                "" + (item.fields.lane_number || "N/A"),
                generateSeedTimeString(item.fields.seed_time)
            ]} />
        )
    }

    return (
        <DataTable
            apiRoute="/api/v1/relay_entries/"
            queryParams={{
                specific_to: "event",
                event_id: eventData.pk
            }}
            searchType="RELAY_ENTRY_OF_EVENT"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create an relay entry" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${eventData.fields.session.fields.meet}/relay_entries/create`)} />
            ]}
            tableCols={[
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />
            ]}
            tableHeaderTitles={[
                "Participants", "Team", "Heat", "Lane", "Seed Time"
            ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no relay entries were found."
            loadMoreText="Load more relay entries"
            isMeetHost={isMeetHost}
        />
    )
}