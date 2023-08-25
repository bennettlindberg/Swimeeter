import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Meet } from "../../utilities/helpers/modelTypes.ts";
import { MeetHeatSheet } from "../../utilities/helpers/heatSheetTypes.ts";
import { MeetContext } from "../../pages/meets/MeetPage.tsx";

import { PageButton } from "../../utilities/general/PageButton";
import { HeatSheetHeader } from "../../utilities/heat_sheets/HeatSheetHeader";
import { HeatSheetText } from "../../utilities/heat_sheets/HeatSheetText.tsx";
import { HeatSheetHeatHeader } from "../../utilities/heat_sheets/HeatSheetHeatHeader.tsx";
import { HeatSheetLaneEntry } from "../../utilities/heat_sheets/HeatSheetLaneEntry.tsx";
import { generateSeedTimeString } from "../../utilities/helpers/nameGenerators.ts";
import { HeatSheetDivider } from "../../utilities/heat_sheets/HeatSheetDivider.tsx";

// ~ component
export function MeetHeatSheetTable() {
    // * initialize context, state, and navigation
    const { meetData, isMeetHost }: { meetData: Meet, isMeetHost: boolean } = useContext(MeetContext);
    const [seedingData, setSeedingData] = useState<MeetHeatSheet | null>(null);
    const navigate = useNavigate();

    // * define seeding data loader
    async function loadSeedingData() {
        // @ make call to back-end for seeding data
        try {
            const response = await axios.get(
                "/api/v1/heat_sheets/",
                {
                    params: {
                        specific_to: "meet",
                        meet_id: meetData.pk
                    }
                }
            );

            setSeedingData(response.data);
        } catch {
            // ? error retrieving seeding data
            navigate("/errors/unknown");
        }
    }

    return (
        <>
            {seedingData
                ? <>
                    <div className="flex flex-row gap-x-2 justify-start items-end">
                        {isMeetHost && <PageButton color="green" text="Manage meet seeding" icon="WHEEL_NUT" handleClick={() => navigate(`/meets/${meetData.pk}/seeding`)} />}
                    </div>
                    <HeatSheetHeader
                        color="primary"
                        title={seedingData.meet_name + " Heat Sheet"}
                    >
                        {
                            seedingData.sessions_data.length > 0
                                ? seedingData.sessions_data.map((session_data) => {
                                    return <HeatSheetDivider
                                        color="purple"
                                        title={"Session #" + session_data.session_number + ": " + session_data.session_name}
                                    >
                                        {
                                            session_data.events_data.length > 0
                                                ? session_data.events_data.map((event_data) => {
                                                    return <HeatSheetDivider
                                                        color="orange"
                                                        title={"Event #" + event_data.event_number + ": " + event_data.event_name}
                                                    >
                                                        {
                                                            event_data.heats_data
                                                                ? event_data.heats_data.length > 0
                                                                    ? event_data.heats_data.map((heat_data) => {
                                                                        return <HeatSheetDivider
                                                                            color="primary"
                                                                            title={"Heat #" + heat_data.heat_number}
                                                                        >
                                                                            <HeatSheetHeatHeader is_relay={event_data.event_is_relay}>
                                                                                {
                                                                                    heat_data.lanes_data.map((lane_data) => {
                                                                                        return <HeatSheetLaneEntry 
                                                                                            lane={lane_data.lane_number}
                                                                                            name={lane_data.entry_data ? lane_data.entry_data.entry_name : ""}
                                                                                            team={lane_data.entry_data ? lane_data.entry_data.entry_team : ""}
                                                                                            seed_time={lane_data.entry_data ? generateSeedTimeString(lane_data.entry_data.entry_seed_time) : ""}
                                                                                        />
                                                                                    })
                                                                                }
                                                                            </HeatSheetHeatHeader>
                                                                        </HeatSheetDivider>
                                                                    })
                                                                    : <HeatSheetText text="This event has zero heats." />
                                                                : <HeatSheetText text="Sorry, no seeding exists yet for this event." />
                                                        }
                                                    </HeatSheetDivider>
                                                })
                                                : <HeatSheetText text="This session has zero events." />
                                        }
                                    </HeatSheetDivider>
                                })
                                : <HeatSheetText text="This meet has zero sessions." />
                        }
                    </HeatSheetHeader>
                </>
                : <PageButton color="primary" text="Load heat sheet" icon="LIST_DOWN" handleClick={loadSeedingData} />
            }
        </>
    )
}