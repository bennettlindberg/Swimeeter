import { useState, useContext, useEffect, useRef, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { Pool } from "../../utilities/helpers/modelTypes.ts";
import { PoolTree } from "../../utilities/helpers/navTreeTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

import { PoolEditingForm } from "../../sections/pool_page/PoolEditingForm.tsx";

// * create pool context
export const PoolContext = createContext<{
    poolData: Pool,
    setPoolData: React.Dispatch<React.SetStateAction<Pool>>,
    isMeetHost: boolean
}>({
    poolData: {
        model: "",
        pk: -1,
        fields: {
            name: "",
            street_address: "",
            city: "",
            state: "",
            country: "",
            zipcode: "",
            lanes: -1,
            side_length: -1,
            measure_unit: "",
            meet: {
                model: "",
                pk: -1,
                fields: {
                    name: "",
                    begin_time: null,
                    end_time: null,
                    is_public: false,
                    host: -1
                }
            }
        }
    },
    setPoolData: () => { },
    isMeetHost: false
});

// ~ component
export function PoolPage() {
    // * initialize context and navigation
    const { navTreeDispatch, setTabTitle }: {
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize state and params
    const [poolData, setPoolData] = useState<Pool>({
        model: "",
        pk: -1,
        fields: {
            name: "",
            street_address: "",
            city: "",
            state: "",
            country: "",
            zipcode: "",
            lanes: -1,
            side_length: -1,
            measure_unit: "",
            meet: {
                model: "",
                pk: -1,
                fields: {
                    name: "",
                    begin_time: null,
                    end_time: null,
                    is_public: false,
                    host: -1
                }
            }
        }
    });
    const [isMeetHost, setIsMeetHost] = useState<boolean>(false);

    // * initialize URL params
    const { meet_id, pool_id } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    const pool_id_INT = convertStringParamToInt(pool_id || "-1");
    if (meet_id_INT === -1 || pool_id_INT === -1) {
        navigate("/errors/unknown");
    }

    // * retrieve pool data
    useEffect(() => {
        async function retrievePoolData() {
            try {
                // @ retrieve pool data with back-end request
                const response = await axios.get("/api/v1/pools/", {
                    params: {
                        specific_to: "id",
                        meet_id: meet_id_INT,
                        pool_id: pool_id_INT
                    }
                });

                setPoolData(response.data);
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        retrievePoolData();
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

                setIsMeetHost(response.data.has_editing_access);
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        checkIfMeetHost();
    }, []);

    // * update nav tree
    useEffect(() => {
        async function retrieveTreeData() {
            try {
                // @ make back-end request for tree data
                const response = await axios.get("/api/v1/info/",
                {
                    params: {
                        info_needed: "relationship_tree",
                        model_type: "Pool",
                        model_id: pool_id_INT
                    }
                });

                const treeData: PoolTree = response.data;
                navTreeDispatch({
                    type: "UPDATE_TREE",
                    data: [
                        { title: "HOME", route: "/" },
                        { title: "MEETS", route: "/meets" },
                        { title: treeData.MEET.title.toUpperCase(), route: treeData.MEET.route},
                        { title: treeData.POOL.title.toUpperCase(), route: treeData.POOL.route}
                    ]
                });
            } catch (error) {
                // ? back-end error retrieving tree data
                console.log(error)
                navigate("/errors/unknown");
            }
        }
        retrieveTreeData();
    }, [poolData]);

    // * update tab title
    useEffect(() => setTabTitle(`${poolData.fields.name || "Pool"} | Swimeeter`), [poolData]);

    // * create main content section refs
    const informationRef = useRef<HTMLHeadingElement>(null);
    const sessionsRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <PoolContext.Provider value={{
                poolData: poolData,
                setPoolData: setPoolData,
                isMeetHost: isMeetHost
            }}>
                <ContentPage
                    title={poolData.fields.name}
                    primaryContent={[
                        {
                            heading: "Information",
                            icon: "CIRCLE_PIN",
                            ref: informationRef,
                            content: (
                                <>
                                    <PoolEditingForm />
                                </>
                            )
                        },
                        {
                            heading: "Sessions",
                            icon: "CALENDAR",
                            ref: sessionsRef,
                            content: (
                                <>
                                    {/* <PoolSessionsTable /> */}
                                </>
                            )
                        },
                    ]}
                    secondaryContent={[
                        <>
                            <SideBarText>
                                Adding multiple pools allows you to manage meets that are running events at numerous locations. Most meets, however, will only require adding one pool.
                            </SideBarText>
                        </>
                    ]}
                />
            </PoolContext.Provider>
        </>
    )
}