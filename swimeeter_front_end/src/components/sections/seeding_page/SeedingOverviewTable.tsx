import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { OverviewHeatSheet } from "../../utilities/helpers/heatSheetTypes.ts";
import { SeedingContext } from "../../pages/seeding/SeedingPage.tsx";
import { generateSeedTimeString } from "../../utilities/helpers/nameGenerators.ts";

import { HeatSheetHeader } from "../../utilities/heat_sheets/HeatSheetHeader";
import { HeatSheetDivider } from "../../utilities/heat_sheets/HeatSheetDivider.tsx";
import { HeatSheetHeatHeader } from "../../utilities/heat_sheets/HeatSheetHeatHeader.tsx";
import { HeatSheetLaneEntry } from "../../utilities/heat_sheets/HeatSheetLaneEntry.tsx";
import { HeatSheetText } from "../../utilities/heat_sheets/HeatSheetText.tsx";
import { SeedingValidIndicator } from "../../utilities/heat_sheets/SeedingValidIndicator.tsx";

// ~ component
export function SeedingOverviewTable() {
    // * initialize context, state, and navigation
    const { seedingData }: { seedingData: OverviewHeatSheet } = useContext(SeedingContext);
    const navigate = useNavigate();

    return (
        <>
            {seedingData.meet_id !== -1 &&
                <HeatSheetHeader
                    color="primary"
                    title={seedingData.meet_name + " Heat Sheet"}
                    indicator={<SeedingValidIndicator valid={seedingData.meet_seeding_full}/>}
                >
                    {
                        seedingData.sessions_data.length > 0
                            ? seedingData.sessions_data.map((session_data) => {
                                return <HeatSheetDivider
                                    color="purple"
                                    title={"Session #" + session_data.session_number + ": " + session_data.session_name}
                                    indicator={<SeedingValidIndicator valid={session_data.session_seeding_full}/>}
                                >
                                    {
                                        session_data.events_data.length > 0
                                            ? session_data.events_data.map((event_data) => {
                                                return <HeatSheetDivider
                                                    color="orange"
                                                    title={"Event #" + event_data.event_number + ": " + event_data.event_name}
                                                    indicator={<SeedingValidIndicator valid={event_data.heats_data ? true : false}/>}
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
                                                            : <HeatSheetText text="No seeding exists for this event." />
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
            }
        </>
    )
}