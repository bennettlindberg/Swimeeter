import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Session } from "../../utilities/helpers/modelTypes.ts";
import { SessionHeatSheet } from "../../utilities/helpers/heatSheetTypes.ts";
import { SessionContext } from "../../pages/sessions/SessionPage.tsx";
import { generateSeedTimeString } from "../../utilities/helpers/nameGenerators.ts";

import { PageButton } from "../../utilities/general/PageButton";
import { HeatSheetHeader } from "../../utilities/heat_sheets/HeatSheetHeader";
import { HeatSheetDivider } from "../../utilities/heat_sheets/HeatSheetDivider.tsx";
import { HeatSheetHeatHeader } from "../../utilities/heat_sheets/HeatSheetHeatHeader.tsx";
import { HeatSheetLaneEntry } from "../../utilities/heat_sheets/HeatSheetLaneEntry.tsx";
import { HeatSheetText } from "../../utilities/heat_sheets/HeatSheetText.tsx";

// ~ component
export function SessionHeatSheetTable() {
    // * initialize context, state, and navigation
    const { sessionData, isMeetHost }: { sessionData: Session, isMeetHost: boolean } = useContext(SessionContext);
    const [seedingData, setSeedingData] = useState<SessionHeatSheet | null>(null);
    const navigate = useNavigate();

    // * define seeding data loader
    async function loadSeedingData() {
        // @ make call to back-end for seeding data
        try {
            const response = await axios.get(
                "/api/v1/heat_sheets/",
                {
                    params: {
                        specific_to: "session",
                        session_id: sessionData.pk
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
            <div>
                <div className="flex lg:flex-row flex-col gap-y-2 gap-x-2 justify-start lg:items-end">
                    {!seedingData && <PageButton color="primary" text="Load heat sheet" icon="LIST_DOWN" handleClick={loadSeedingData} />}
                    {isMeetHost && <PageButton color="green" text="Manage meet seeding" icon="WHEEL_NUT" handleClick={() => navigate(`/meets/${sessionData.fields.meet.pk}/seeding`)} />}
                </div>
            </div>
            {seedingData &&
                <HeatSheetHeader
                    color="purple"
                    title={"Session #" + seedingData.session_number + ": " + seedingData.session_name}
                >
                    {
                        seedingData.events_data.length > 0
                            ? seedingData.events_data.map((event_data) => {
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
                </HeatSheetHeader >
            }
        </>
    )
}