import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { AppContext, UserAction, UserState } from "../../../App.tsx";

import { PageButton } from "../../utilities/general/PageButton.tsx";
import { DestructivePane } from "../../utilities/forms/DestructivePane.tsx";

export function AccountDeletion() {
    // * initialize context, state, and navigation
    const { userState, userDispatch }: {
        userState: UserState,
        userDispatch: React.Dispatch<UserAction>,
    } = useContext(AppContext);
    const [status, setStatus] = useState<"normal" | "confirming">("normal");
    const navigate = useNavigate();

    // * define account deletion handler
    async function handleAccountDeletion(dismissDestructiveDeletion: boolean) {
        if (!dismissDestructiveDeletion) {
            setStatus("confirming");
            return;
        }

        // @ send log out request to the back-end
        try {
            const response = await axios.delete('/auth/delete_account/');

            userDispatch({
                type: "DELETE_ACCOUNT",
                preferences: response.data.preferences
            })

            navigate("/");
        } catch (error) {
            // ? log out failed on the back-end
            navigate("errors/unknown");
        }
    }

    // * define handleClick
    function handleClick(
        selection: "continue" | "cancel", 
        context: "duplicate_keep_new" | "destructive_submission" | "destructive_deletion" | "unknown", // ! ignore
        duplicate_handling?: "unhandled" | "keep_new" | "keep_both" // ! ignore
    ) {
        if (selection === "continue") {
            handleAccountDeletion(true);
        } else {
            setStatus("normal");
        }
    }

    return (
        <>
            <div className={`relative ${status === "confirming" ? "h-[250px]" : "h-fit"}`}>
                <PageButton color="red" icon="TRASH_CAN" text="Delete account" handleClick={() => handleAccountDeletion(false)} />
                {status === "confirming" &&
                    <div className="flex flex-col justify-center items-center h-full w-full absolute top-0 left-0 bg-slate-200 dark:bg-slate-800 bg-opacity-50 dark:bg-opacity-50">
                        <div className="w-[80%] h-[80%]">
                            <DestructivePane info={{
                                title: "DESTRUCTIVE DELETION",
                                description: "Deleting this Swimeeter account will permanently delete the account and all its meets. Are you sure you want to continue?",
                                impact: "Permanent deletion of this account and all its associated data."
                            }} handleClick={handleClick}/>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}