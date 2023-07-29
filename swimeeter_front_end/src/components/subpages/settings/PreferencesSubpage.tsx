import { useReducer } from "react";

import { PageButton } from "../../utilities/general/PageButton.tsx";
import { PreferencesForm } from "../../utilities/forms/PreferencesForm.tsx";

// * define types
type PageState = {
    status: "view" | "edit"
}

type PageAction = {
    type: "EDIT_CLICKED" | "CANCEL_CLICKED" | "SAVE_CLICKED"
}

// * define page reducer
function pageReducer(state: PageState, action: PageAction) {
    switch (action.type) {
        case "EDIT_CLICKED":
            return { status: "edit" } as PageState;

        case "CANCEL_CLICKED":
            return { status: "view" } as PageState;

        case "SAVE_CLICKED":
            return { status: "view" } as PageState;

        default:
            return state;
    }
}

// ~ component
export function PreferencesSubpage() {
    // * initialize state variables
    const [pageState, pageDispatch] = useReducer(pageReducer, { status: "view" });

    switch (pageState.status) {
        case "edit":
            return (
                <>
                    <PreferencesForm editAllowed={true} dispatch={pageDispatch} />
                </>
            )

        case "view":
        default:
            return (
                <>
                    <PreferencesForm editAllowed={false} dispatch={pageDispatch} />
                </>
            )
    }
}