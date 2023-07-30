import { useContext, useEffect, useRef } from "react";

import { AppContext, NavTreeAction, UserState } from "../../../App.tsx";
import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";
import { ProfileSubpage } from "../../sections/settings/ProfileSubpage.tsx";
import { PreferencesForm } from "../../sections/settings/PreferencesForm.tsx";

// ~ component
export function SettingsPage() {
    // * initialize context
    const { userState, navTreeDispatch, setTabTitle }: {
        userState: UserState,
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);

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
                                <ProfileSubpage />
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
                                ? <PageButton color="red" text="Log out" icon="USER_MINUS" handleClick={() => { }} />
                                : <div className="flex flex-row flex-wrap gap-x-2">
                                    <PageButton color="green" text="Log in" icon="USER_CHECK" handleClick={() => { }} />
                                    <PageButton color="green" text="Sign up" icon="USER_PLUS" handleClick={() => { }} />
                                </div>
                        }
                    </>
                ]}
            />
        </>
    )
}