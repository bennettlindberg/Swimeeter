import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext, NavTreeAction, UserState } from "../../../App.tsx";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";
import { LogInForm } from "../../sections/auth/LogInForm.tsx";

// ~ component
export function LogInPage() {
    // * initialize context and navigation
    const { userState, navTreeDispatch, setTabTitle }: {
        userState: UserState,
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // ? already logged in
    if (userState.logged_in) {
        navigate("/")
    }

    // * update nav tree
    useEffect(() => {
        navTreeDispatch({
            type: "UPDATE_TREE",
            data: [
                { title: "HOME", route: "/" },
                { title: "LOG IN", route: "/log_in" }
            ]
        })
    }, []);

    // * update tab title
    useEffect(() => setTabTitle("Log In | Swimeeter"), []);

    // * create main content section refs
    const signUpRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <ContentPage
                title="Log In"
                primaryContent={[
                    {
                        heading: "Log In",
                        icon: "USER_CHECK",
                        ref: signUpRef,
                        content: (
                            <>
                                <LogInForm />
                            </>
                        )
                    }
                ]}
                secondaryContent={[
                    <>
                        <SideBarText>
                            Don't have an account yet?
                        </SideBarText>
                        <PageButton color="green" text="Sign up" icon="USER_PLUS" handleClick={() => navigate("/sign_up")} />
                    </>
                ]}
            />
        </>
    )
}