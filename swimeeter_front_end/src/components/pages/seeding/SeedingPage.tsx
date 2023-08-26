import { useState, useContext, useEffect, useRef, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { OverviewHeatSheet } from "../../utilities/helpers/heatSheetTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

import { SeedingOverviewTable } from "../../sections/seeding_page/SeedingOverviewTable.tsx";
import { SeedingGenerationForm } from "../../sections/seeding_page/SeedingGenerationForm.tsx";

// * create seeding context
export const SeedingContext = createContext<{
    seedingData: OverviewHeatSheet,
    setSeedingData: React.Dispatch<React.SetStateAction<OverviewHeatSheet>>,
}>({
    seedingData: {
        meet_id: -1,
        meet_name: "",
        meet_seeding_full: false,
        sessions_data: []
    },
    setSeedingData: () => { },
});

// ~ component
export function SeedingPage() {
    // * initialize context and navigation
    const { navTreeDispatch, setTabTitle }: {
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize state and params
    const [seedingData, setSeedingData] = useState<OverviewHeatSheet>({
        meet_id: -1,
        meet_name: "",
        meet_seeding_full: false,
        sessions_data: []
    });
    const [isMeetHost, setIsMeetHost] = useState<boolean>(false);

    // * initialize URL params
    const { meet_id } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    if (meet_id_INT === -1) {
        navigate("/errors/unknown");
    }

    // * retrieve meet seeding data
    useEffect(() => {
        async function retrieveMeetSeedingData() {
            try {
                // @ retrieve meet seeding data with back-end request
                const response = await axios.get("/api/v1/heat_sheets/", {
                    params: {
                        specific_to: "overview",
                        meet_id: meet_id_INT,
                    }
                });

                setSeedingData(response.data);
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        retrieveMeetSeedingData();
    }, []);

    // * check if meet host
    useEffect(() => {
        async function checkIfMeetHost() {
            try {
                // @ check if meet host with back-end request
                const response = await axios.get("/api/v1/info/", {
                    params: {
                        info_needed: "editing_access",
                        model_type: "Meet",
                        model_id: meet_id_INT
                    }
                });

                if (response.data.has_editing_access) {
                    setIsMeetHost(true);
                } else {
                    // ? not meet host -> cannot view seeding page
                    navigate(`/meets/${meet_id_INT}`);
                }
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        checkIfMeetHost();
    }, []);

    // * update nav tree
    useEffect(() => {
        navTreeDispatch({
            type: "UPDATE_TREE",
            data: [
                { title: "HOME", route: "/" },
                { title: "MEETS", route: "/meets" },
                { title: `${seedingData.meet_name.toUpperCase() || "MEET"}`, route: `/meets/${meet_id_INT}` },
                { title: `MANAGE ${seedingData.meet_name.toUpperCase() || "MEET"} SEEDING`, route: `/meets/${meet_id_INT}/seeding` }
            ]
        })
    }, [seedingData]);

    // * update tab title
    useEffect(() => setTabTitle(`Manage ${seedingData.meet_name || "Meet"} Seeding | Swimeeter`), [seedingData]);

    // * create main content section refs
    const generationRef = useRef<HTMLHeadingElement>(null);
    const overviewRef = useRef<HTMLHeadingElement>(null);

    // * avoid rending page before meet host verification and seeding data retrieved
    if (!isMeetHost || seedingData.meet_id === -1) {
        return <></>;
    }

    return (
        <>
            <SeedingContext.Provider value={{
                seedingData: seedingData,
                setSeedingData: setSeedingData,
            }}>
                <ContentPage
                    title={`Manage ${seedingData.meet_name || "Meet"} Seeding`}
                    primaryContent={[
                        {
                            heading: "Generate seeding",
                            icon: "WHEEL_NUT",
                            ref: generationRef,
                            content: (
                                <>
                                    <SeedingGenerationForm />
                                </>
                            )
                        },
                        {
                            heading: "Seeding overview",
                            icon: "EARTH_GLOBE",
                            ref: overviewRef,
                            content: (
                                <>
                                    <SeedingOverviewTable />
                                </>
                            )
                        }
                    ]}
                    secondaryContent={[
                        <>
                            <SideBarText>
                                Heat sheet seeding can be generated for a specific event, a whole session, or an entire meet all at once using the seeding generator.
                            </SideBarText>
                        </>,
                        <>
                            <SideBarText>
                                Modifying the meet's details, such as the meet's events, swimmers, and entries, may cause some events' seeding to be invalidated and deleted.
                            </SideBarText>
                        </>
                    ]}
                />
            </SeedingContext.Provider>
        </>
    )
}