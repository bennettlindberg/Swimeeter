import { useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AppContext, NavTreeAction, UserState } from "../../../App.tsx";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";
import { LogInForm } from "../../sections/auth_pages/LogInForm.tsx";

// ~ component
export function LogInPage() {
    // * initialize context and navigation
    const { userState, navTreeDispatch, setTabTitle }: {
        userState: UserState,
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * initialize location
    const location = useLocation();
    let forwardTo: string | undefined = undefined;
    try {
        forwardTo = location.state.forwardTo;
    } catch {
        forwardTo = undefined;
    }

    // ? already logged in
    if (userState.logged_in) {
        navigate(forwardTo || "/", { replace: true });
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
                                <LogInForm forwardTo={forwardTo} />
                            </>
                        )
                    }
                ]}
                secondaryContent={[
                    <>
                        <SideBarText>
                            Don't have an account yet?
                        </SideBarText>
                        <PageButton color="green" text="Sign up" icon="USER_PLUS" handleClick={() => forwardTo ? navigate("/sign_up", { state: { forwardTo: forwardTo } }) : navigate("/sign_up")} />
                    </>
                ]}
            />
        </>
    )
}