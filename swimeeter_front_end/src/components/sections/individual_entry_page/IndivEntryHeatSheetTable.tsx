import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { IndividualEntry } from "../../utilities/helpers/modelTypes.ts";
import { EntryHeatSheet } from "../../utilities/helpers/heatSheetTypes.ts";
import { IndividualEntryContext } from "../../pages/individual_entries/IndividualEntryPage.tsx";
import { generateSeedTimeString } from "../../utilities/helpers/nameGenerators.ts";

import { HeatSheetHeader } from "../../utilities/heat_sheets/HeatSheetHeader.tsx";
import { HeatSheetHeatHeader } from "../../utilities/heat_sheets/HeatSheetHeatHeader.tsx";
import { HeatSheetLaneEntry } from "../../utilities/heat_sheets/HeatSheetLaneEntry.tsx";
import { PageButton } from "../../utilities/general/PageButton";
import { HeatSheetText } from "../../utilities/heat_sheets/HeatSheetText.tsx";

// ~ component
export function IndivEntryHeatSheetTable() {
    // * initialize context, state, and navigation
    const { individualEntryData, isMeetHost }: { individualEntryData: IndividualEntry, isMeetHost: boolean } = useContext(IndividualEntryContext);
    const [seedingData, setSeedingData] = useState<EntryHeatSheet | null>(null);
    const navigate = useNavigate();

    // * define seeding data loader
    async function loadSeedingData() {
        // @ make call to back-end for seeding data
        try {
            const response = await axios.get(
                "/api/v1/heat_sheets/",
                {
                    params: {
                        specific_to: "individual_entry",
                        entry_id: individualEntryData.pk
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
                    {isMeetHost && <PageButton color="green" text="Manage meet seeding" icon="WHEEL_NUT" handleClick={() => navigate(`/meets/${individualEntryData.fields.swimmer.fields.meet.pk}/seeding`)} />}
                </div>
            </div>
            {seedingData &&
                (seedingData.heat_data
                    ? <HeatSheetHeader
                        color="primary"
                        title={"Heat #" + seedingData.heat_data.heat_number}
                    >
                        <HeatSheetHeatHeader is_relay={false}>
                            {
                                seedingData.heat_data.lanes_data.map((lane_data) => {
                                    return <HeatSheetLaneEntry
                                        lane={lane_data.lane_number}
                                        name={lane_data.entry_data ? lane_data.entry_data.entry_name : ""}
                                        team={lane_data.entry_data ? lane_data.entry_data.entry_team : ""}
                                        seed_time={lane_data.entry_data ? generateSeedTimeString(lane_data.entry_data.entry_seed_time) : ""}
                                    />
                                })
                            }
                        </HeatSheetHeatHeader>
                    </HeatSheetHeader>
                    : <HeatSheetText text="This entry has no seeding yet." />
                )
            }
        </>
    )
}