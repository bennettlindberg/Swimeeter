import { useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { AppContext, NavTreeAction, UserState } from "../../../App.tsx";

import { ContentPage } from "../../utilities/general/ContentPage.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";
import { SignUpForm } from "../../sections/auth/SignUpForm.tsx";

// ~ component
export function SignUpPage() {
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
                { title: "SIGN UP", route: "/sign_up" }
            ]
        })
    }, []);

    // * update tab title
    useEffect(() => setTabTitle("Sign Up | Swimeeter"), []);

    // * create main content section refs
    const signUpRef = useRef<HTMLHeadingElement>(null);

    return (
        <>
            <ContentPage
                title="Sign Up"
                primaryContent={[
                    {
                        heading: "Sign Up",
                        icon: "USER_PLUS",
                        ref: signUpRef,
                        content: (
                            <>
                                <SignUpForm forwardTo={forwardTo} />
                            </>
                        )
                    }
                ]}
                secondaryContent={[
                    <>
                        <SideBarText>
                            Already have an account?
                        </SideBarText>
                        <PageButton color="green" text="Log in" icon="USER_CHECK" handleClick={() => forwardTo ? navigate("/log_in", { state: { forwardTo: forwardTo } }) : navigate("/log_in")} />
                    </>
                ]}
            />
        </>
    )
}