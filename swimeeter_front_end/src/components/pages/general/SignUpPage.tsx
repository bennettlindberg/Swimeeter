import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
                                <SignUpForm />
                            </>
                        )
                    }
                ]}
                secondaryContent={[
                    <>
                        <SideBarText>
                            Already have an account?
                        </SideBarText>
                        <PageButton color="green" text="Log in" icon="USER_CHECK" handleClick={() => navigate("/log_in")} />
                    </>
                ]}
            />
        </>
    )
}