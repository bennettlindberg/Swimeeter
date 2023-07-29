import { useContext, useReducer } from "react";

import { AppContext, UserState } from "../../../App.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";
import { MainContentText } from "../../utilities/main_content/MainContentText.tsx";
import { ProfileForm } from "../../utilities/forms/ProfileForm.tsx";

// * define types
type PageState = {
    status: "logged_out" | "logged_in_view" | "logged_in_edit"
}

type PageAction = {
    type: "EDIT_CLICKED" | "CANCEL_CLICKED" | "SAVE_CLICKED"
}

// * define page reducer
function pageReducer(state: PageState, action: PageAction) {
    switch (action.type) {
        case "EDIT_CLICKED":
            return { status: "logged_in_edit" } as PageState;

        case "CANCEL_CLICKED":
            return { status: "logged_in_view" } as PageState;

        case "SAVE_CLICKED":
            return { status: "logged_in_view" } as PageState;

        default:
            return state;
    }
}

// ~ component
export function ProfileSubpage() {
    // * initialize context
    const { userState }: { userState: UserState } = useContext(AppContext);

    // * initialize state variables
    const [pageState, pageDispatch] = useReducer(pageReducer, { status: userState.logged_in ? "logged_in_view" : "logged_out" });

    switch (pageState.status) {
        case "logged_in_view":
            return (
                <>
                    <ProfileForm editAllowed={false} dispatch={pageDispatch} />
                </>
            )

        case "logged_in_edit":
            return (
                <>
                    <ProfileForm editAllowed={true} dispatch={pageDispatch} />
                </>
            )

        case "logged_out":
        default:
            return (
                <>
                    <MainContentText>
                        Log in or sign up to view your Swimeeter account profile.
                    </MainContentText>
                    <PageButton color="green" text="Log in" icon="USER_CHECK" handleClick={() => { }} />
                    <PageButton color="green" text="Sign up" icon="USER_PLUS" handleClick={() => { }} />
                </>
            )
    }
}