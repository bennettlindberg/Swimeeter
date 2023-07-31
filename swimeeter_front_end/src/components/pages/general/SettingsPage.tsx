import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AppContext, NavTreeAction, UserAction, UserState } from "../../../App.tsx";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";
import { PreferencesForm } from "../../sections/settings/PreferencesForm.tsx";

// ~ component
export function SettingsPage() {
    // * initialize context and navigation
    const { userState, userDispatch, navTreeDispatch, setTabTitle }: {
        userState: UserState,
        userDispatch: React.Dispatch<UserAction>,
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * update nav tree
    useEffect(() => {
        navTreeDispatch({
            type: "UPDATE_TREE",
            data: [
                { title: "HOME", route: "/" },
                { title: "SETTINGS", route: "/settings" }
            ]
        })
    }, []);

    // * update tab title
    useEffect(() => setTabTitle("Settings | Swimeeter"), []);

    // * create main content section refs
    const profileRef = useRef<HTMLHeadingElement>(null);
    const preferencesRef = useRef<HTMLHeadingElement>(null);

    // * define logout handler
    async function handleLogOut() {
        // @ send log out request to the back-end
        try {
            const response = await axios.post('/auth/log_out/');

            userDispatch({
                type: "LOG_OUT",
                preferences: response.data.preferences
            })

            navigate("/");
        } catch (error) {
            // ? log out failed on the back-end
            // ! unhandled
        }
    }

    return (
        <>
            <ContentPage
                title="Settings"
                primaryContent={[
                    {
                        heading: "Profile",
                        icon: "CIRCLE_USER",
                        ref: profileRef,
                        content: (
                            <>

                            </>
                        )
                    },
                    {
                        heading: "Preferences",
                        icon: "SETTINGS",
                        ref: preferencesRef,
                        content: (
                            <>
                                <PreferencesForm />
                            </>
                        )
                    }
                ]}
                secondaryContent={[
                    <>
                        {
                            userState.logged_in
                                ? <PageButton color="red" text="Log out" icon="USER_MINUS" handleClick={handleLogOut} />
                                : <div className="flex flex-row flex-wrap gap-x-2">
                                    <PageButton color="green" text="Log in" icon="USER_CHECK" handleClick={() => navigate("/log_in")} />
                                    <PageButton color="green" text="Sign up" icon="USER_PLUS" handleClick={() => navigate("/sign_up")} />
                                </div>
                        }
                    </>
                ]}
            />
        </>
    )
}