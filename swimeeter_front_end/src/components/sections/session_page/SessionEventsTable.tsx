import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { SessionContext } from "../../pages/sessions/SessionPage.tsx";
import { Session, Event } from "../../utilities/helpers/modelTypes.ts";
import { generateCompetitorsString } from "../../utilities/helpers/nameGenerators.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function SessionEventsTable() {
    // * initialize context, state, and navigation
    const { sessionData, isMeetHost }: { sessionData: Session, isMeetHost: boolean } = useContext(SessionContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (sessionData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: Event) {
        return (
            <TableRow handleClick={() => navigate(`/meets/${sessionData.fields.meet.pk}/events/${item.fields.is_relay ? "relay" : "individual"}/${item.pk}`)} entries={[
                `${item.fields.distance}`,
                item.fields.stroke,
                generateCompetitorsString(item.fields.competing_gender, item.fields.competing_min_age, item.fields.competing_max_age),
                item.fields.is_relay ? "Relay" : "Individual",
                item.fields.stage
            ]} />
        )
    }

    return (
        <DataTable
            apiRoute="/api/v1/events/"
            queryParams={{
                specific_to: "session",
                session_id: sessionData.pk
            }}
            searchType="EVENT_OF_SESSION"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create an indiv. event" icon="CIRCLE_PLUS" handleClick={() =>
                    navigate(
                        `/meets/${sessionData.fields.meet.pk}/events/individual/create`,
                        {
                            state: {
                                defaultSession: {
                                    name: sessionData.fields.name,
                                    session_id: sessionData.pk
                                }
                            }
                        }
                    )
                } />,
                <PageButton color="orange" text="Create a relay event" icon="CIRCLE_PLUS" handleClick={() =>
                    navigate(
                        `/meets/${sessionData.fields.meet.pk}/events/relay/create`,
                        {
                            state: {
                                defaultSession: {
                                    name: sessionData.fields.name,
                                    session_id: sessionData.pk
                                }
                            }
                        }
                    )
                } />
            ]}
            tableCols={
                [
                    <col span={1} className="w-auto" />,
                    <col span={1} className="w-auto" />,
                    <col span={1} className="w-auto" />,
                    <col span={1} className="w-auto" />,
                    <col span={1} className="w-auto" />
                ]}
            tableHeaderTitles={
                [
                    "Distance", "Stroke", "Competitors", "Type", "Stage"
                ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no events were found."
            loadMoreText="Load more events"
            isMeetHost={isMeetHost}
        />
    )
}