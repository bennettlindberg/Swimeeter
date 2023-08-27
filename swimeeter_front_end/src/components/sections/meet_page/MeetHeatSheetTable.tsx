import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Meet } from "../../utilities/helpers/modelTypes.ts";
import { MeetHeatSheet } from "../../utilities/helpers/heatSheetTypes.ts";
import { MeetContext } from "../../pages/meets/MeetPage.tsx";
import { AppContext, UserState } from "../../../App.tsx";
import { generateSeedTimeString } from "../../utilities/helpers/nameGenerators.ts";

import { PageButton } from "../../utilities/general/PageButton";
import { HeatSheetHeader } from "../../utilities/heat_sheets/HeatSheetHeader";
import { HeatSheetDivider } from "../../utilities/heat_sheets/HeatSheetDivider.tsx";
import { HeatSheetHeatHeader } from "../../utilities/heat_sheets/HeatSheetHeatHeader.tsx";
import { HeatSheetLaneEntry } from "../../utilities/heat_sheets/HeatSheetLaneEntry.tsx";
import { HeatSheetText } from "../../utilities/heat_sheets/HeatSheetText.tsx";
import { IconButton } from "../../utilities/general/IconButton.tsx";
import { InfoPane } from "../../utilities/forms/InfoPane.tsx";

// ~ component
export function MeetHeatSheetTable() {
    // * initialize context, state, and navigation
    const { meetData, isMeetHost }: { meetData: Meet, isMeetHost: boolean } = useContext(MeetContext);
    const [seedingData, setSeedingData] = useState<MeetHeatSheet | null>(null);

    const { userState }: { userState: UserState } = useContext(AppContext);
    const [infoShown, setInfoShown] = useState<boolean>(false);

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
            <div className="flex flex-col gap-y-2">
                {infoShown &&
                    <InfoPane
                        handleXClick={(event: any) => {
                            event.preventDefault();
                            setInfoShown(false);
                        }}
                        info={{
                            title: "Meet Heat Sheet",
                            description: "The meet heat sheet contains the heat and lane seeding information for all events and sessions of the meet being viewed."
                        }}
                    />}
                <div className="flex lg:flex-row flex-wrap gap-y-2 gap-x-2 items-center justify-start">
                    {userState.preferences.data_entry_information &&
                        <IconButton color="primary" icon="CIRCLE_INFO" handleClick={(event: any) => {
                            event.preventDefault();
                            setInfoShown(!infoShown);
                        }}
                        />}
                    {!seedingData && <PageButton color="primary" text="Load heat sheet" icon="LIST_DOWN" handleClick={loadSeedingData} />}
                    {isMeetHost && <PageButton color="green" text="Manage meet seeding" icon="WHEEL_NUT" handleClick={() => navigate(`/meets/${meetData.pk}/seeding`)} />}
                </div>
            </div>
            {seedingData &&
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
            }
        </>
    )
}