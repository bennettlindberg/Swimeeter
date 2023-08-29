import { useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction, UserState } from "../../../App.tsx";
import { MeetTree } from "../../utilities/helpers/navTreeTypes.ts";
import { convertStringParamToInt } from "../../utilities/helpers/helperFunctions.ts";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";
import { PoolCreationForm } from "../../sections/creation_pages/PoolCreationForm.tsx";

// ~ component
export function PoolCreationPage() {
    // * initialize context and navigation
    const { userState, navTreeDispatch, setTabTitle }: {
        userState: UserState,
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize URL params
    const { meet_id } = useParams();
    const meet_id_INT = convertStringParamToInt(meet_id || "-1");
    if (meet_id_INT === -1) {
        navigate("/errors/unknown");
    }

    // ? redirect to log in if logged out
    if (!userState.logged_in) {
        navigate("/log_in", { state: { forwardTo: `/meets/${meet_id_INT}/pools/create` }, replace: true });
    }

    // * update nav tree
    useEffect(() => {
        async function retrieveTreeData() {
            try {
                // @ make back-end request for tree data
                const response = await axios.get("/api/v1/info/",
                {
                    params: {
                        info_needed: "relationship_tree",
                        model_type: "Meet",
                        model_id: meet_id_INT
                    }
                });

                const treeData: MeetTree = response.data;
                navTreeDispatch({
                    type: "UPDATE_TREE",
                    data: [
                        { title: "HOME", route: "/" },
                        { title: "MEETS", route: "/meets" },
                        { title: treeData.MEET.title.toUpperCase(), route: treeData.MEET.route},
                        { title: "CREATE A POOL", route: `${treeData.MEET.route}/pools/create` }
                    ]
                });
            } catch (error) {
                // ? back-end error retrieving tree data
                navigate("/errors/unknown");
            }
        }
        retrieveTreeData();
    }, []);

    // * update tab title
    useEffect(() => setTabTitle("Create a Pool | Swimeeter"), []);

    // * create main content section refs
    const createPoolRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <ContentPage
                title="Create a Pool"
                primaryContent={[
                    {
                        heading: "Creation Form",
                        icon: "EDIT_PAGE",
                        ref: createPoolRef,
                        content: (
                            <>
                                <PoolCreationForm meet_id_INT={meet_id_INT} scrollRef={createPoolRef}/>
                            </>
                        )
                    }
                ]}
                secondaryContent={[
                    <>
                        <SideBarText>
                            After creating your new pool, you'll be able to add sessions located at the pool to your meet. 
                        </SideBarText>
                    </>
                ]}
            />
        </>
    )
}