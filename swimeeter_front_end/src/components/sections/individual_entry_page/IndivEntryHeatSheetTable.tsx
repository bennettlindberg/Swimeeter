import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { IndividualEntry } from "../../utilities/helpers/modelTypes.ts";
import { EntryHeatSheet } from "../../utilities/helpers/heatSheetTypes.ts";
import { IndividualEntryContext } from "../../pages/individual_entries/IndividualEntryPage.tsx";
import { AppContext, UserState } from "../../../App.tsx";
import { generateSeedTimeString } from "../../utilities/helpers/nameGenerators.ts";

import { HeatSheetHeader } from "../../utilities/heat_sheets/HeatSheetHeader.tsx";
import { HeatSheetHeatHeader } from "../../utilities/heat_sheets/HeatSheetHeatHeader.tsx";
import { HeatSheetLaneEntry } from "../../utilities/heat_sheets/HeatSheetLaneEntry.tsx";
import { PageButton } from "../../utilities/general/PageButton";
import { HeatSheetText } from "../../utilities/heat_sheets/HeatSheetText.tsx";
import { InfoPane } from "../../utilities/forms/InfoPane.tsx";
import { IconButton } from "../../utilities/general/IconButton.tsx";

// ~ component
export function IndivEntryHeatSheetTable() {
    // * initialize context, state, and navigation
    const { individualEntryData, isMeetHost }: { individualEntryData: IndividualEntry, isMeetHost: boolean } = useContext(IndividualEntryContext);
    const [seedingData, setSeedingData] = useState<EntryHeatSheet | null>(null);

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
            <div className="flex flex-col gap-y-2">
                {infoShown &&
                    <InfoPane
                        handleXClick={(event: any) => {
                            event.preventDefault();
                            setInfoShown(false);
                        }}
                        info={{
                            title: "INDIVIDUAL ENTRY HEAT SHEET",
                            description: "The individual entry heat sheet contains the heat and lane seeding information for the heat of the individual entry being viewed."
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
                    : <HeatSheetHeader
                        color="primary"
                        title={"Heat"}
                    >
                        <HeatSheetText text="Sorry, no seeding exists yet for this entry's event." />
                    </HeatSheetHeader>
                )
            }
        </>
    )
}