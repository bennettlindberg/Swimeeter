import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { MeetContext } from "../../pages/meets/MeetPage.tsx";
import { Meet, Swimmer } from "../../utilities/models/modelTypes.ts";

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
        function generateNameString(swimmer: Swimmer) {
            let swimmerName = "";

            if (swimmer.fields.prefix !== "") {
                swimmerName += swimmer.fields.prefix + " ";
            }

            swimmerName += swimmer.fields.first_name + " ";

            if (swimmer.fields.middle_initials !== "") {
                swimmerName += swimmer.fields.middle_initials + " ";
            }

            swimmerName += swimmer.fields.last_name;

            if (swimmer.fields.suffix !== "") {
                swimmerName += " " + swimmer.fields.suffix;
            }

            return swimmerName;
        }

        return (
            <TableRow handleClick={() => navigate(`/meets/${meetData.pk}/swimmers/${item.pk}`)} entries={[
                generateNameString(item),
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
            isMeetHost={isMeetHost}
        />
    )
}