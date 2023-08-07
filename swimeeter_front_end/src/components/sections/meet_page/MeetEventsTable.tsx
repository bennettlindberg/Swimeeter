import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { MeetContext } from "../../pages/meets/MeetPage.tsx";
import { Meet, Event } from "../../utilities/types/modelTypes.ts";

import { DataTable } from "../../utilities/tables/DataTable.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

// ~ component
export function MeetEventsTable() {
    // * initialize context, state, and navigation
    const { meetData, isMeetHost }: {meetData: Meet, isMeetHost: boolean} = useContext(MeetContext);
    const navigate = useNavigate();

    // * prevent table load before true data retrieved
    if (meetData.pk === -1) {
        return <></>;
    }

    // * define table row generator
    function tableRowGenerator(item: Event) {
        function generateCompetitorsString(gender: string, minAge: number | null, maxAge: number | null) {
            let competitorsString = "";
            
            if (minAge && maxAge) {
                competitorsString = `${minAge}-${maxAge}`;
            } else if (minAge) {
                competitorsString = `${minAge} & Under`;
            } else if (maxAge) {
                competitorsString = `${maxAge} & Over`;
            } else {
                competitorsString = "Open";
            }

            return competitorsString + " " + gender;
        }

        return (
            <TableRow handleClick={() => navigate(`/meets/${meetData.pk}/events/${item.pk}`)} entries={[
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
                specific_to: "meet",
                meet_id: meetData.pk
            }}
            searchInfo={{
                title: "EVENT SEARCH",
                description: "The event search field can be used to search for events by their stroke, distance, competing ages, and competing genders.",
                permitted_values: "The provided distance, minimum age, and maximum age must be numerical. Otherwise, any search string is allowed."
            }}
            searchType="EVENT"
            tableBarItems={[]}
            tableBarHostItems={[
                <PageButton color="orange" text="Create an event" icon="CIRCLE_PLUS" handleClick={() => navigate(`/meets/${meetData.pk}/events/create`)} />
            ]}
            tableCols={[
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />,
                <col span={1} className="w-auto" />
            ]}
            tableHeaderTitles={[
                "Distance", "Stroke", "Competitors", "Type", "Stage"
            ]}
            tableRowGenerator={tableRowGenerator}
            noneFoundText="Sorry, no events were found."
            isMeetHost={isMeetHost}
        />
    )
}