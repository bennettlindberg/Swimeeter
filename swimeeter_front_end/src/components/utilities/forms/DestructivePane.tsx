import { useContext } from "react";

import { AppContext, UserState } from "../../../App.tsx";
import { DestructiveType } from "../helpers/formTypes.ts"

import { IconSVG } from "../svgs/IconSVG.tsx";

export function DestructivePane({ handleClick, info }: {
    handleClick: (
        selection: "continue" | "cancel", 
        context: "duplicate_keep_new" | "destructive_submission" | "destructive_deletion" | "unknown", 
        duplicate_handling?: "unhandled" | "keep_new" | "keep_both"
    ) => void,
    info: DestructiveType
}) {
    const { userState }: { userState: UserState } = useContext(AppContext);

    // * automatically confirm if destructive action confirms are turned off
    if (!userState.preferences.destructive_action_confirms) {
        handleClick("continue", info.type || "unknown");
    }

    // * pass along duplicate choice if applicable
    let duplicate_handling: "unhandled" | "keep_new" | "keep_both" | undefined = undefined;
    if (info.type && info.type === "duplicate_keep_new") {
        duplicate_handling = "keep_new";
    }

    const bgColor = "bg-red-100 border-red-200 dark:bg-red-900 dark:border-red-800";
    const textColor = "text-red-400 dark:text-red-500";
    const fillColor = "fill-red-400 dark:fill-red-500";

    const purpleButtonColor = "bg-purple-100 hover:bg-purple-200 border-purple-200 dark:bg-purple-900 hover:dark:bg-purple-800 dark:border-purple-800";
    const purpleTextColor = "text-purple-400 dark:text-purple-500";
    const purpleFillColor = "fill-purple-400 dark:fill-purple-500";

    const slateButtonColor = "bg-slate-100 hover:bg-slate-200 border-slate-200 dark:bg-slate-800 hover:dark:bg-slate-700 dark:border-slate-700";
    const slateTextColor = "text-slate-400 dark:text-slate-500";
    const slateFillColor = "fill-slate-400 dark:fill-slate-500";

    return (
        <>
            <div className="absolute top-0 left-0 w-full h-full bg-slate-200 dark:bg-slate-800 bg-opacity-50 dark:bg-opacity-50 flex flex-col items-center justify-center">
                <div className="flex flex-row justify-center w-[80%]">
                    <div className={`flex flex-col gap-y-1 text-lg p-2 border-2 rounded-md ${textColor} ${bgColor}`}>
                        <div className="flex flex-row gap-x-2 items-center">
                            <IconSVG icon="SHIELD_EXCLAIM" color={fillColor} width="w-[35px]" height="h-[35px]" />
                            <h3 className="font-extrabold text-xl">{info.title}</h3>
                        </div>

                        <p><span className="font-semibold">Confirmation: </span>{info.description}</p>
                        <p><span className="font-semibold">Impact: </span>{info.impact}</p>

                        <div className="flex flex-row flex-wrap gap-x-2 gap-y-1">
                            <button className={`flex flex-row gap-x-2 items-center px-2 py-1 w-fit rounded-full border-2 ${slateButtonColor}`} type="button" onClick={() => { handleClick("cancel", info.type || "unknown", duplicate_handling) }}>
                                <IconSVG icon={"CIRCLE_CROSS"} color={slateFillColor} width="w-[25px]" height="h-[25px]" />
                                <p className={`text-xl font-semibold ${slateTextColor}`}>Cancel</p>
                            </button>
                            <button className={`flex flex-row gap-x-2 items-center px-2 py-1 w-fit rounded-full border-2 ${purpleButtonColor}`} type="button" onClick={() => { handleClick("continue", info.type || "unknown", duplicate_handling) }}>
                                <IconSVG icon={"CIRCLE_BOLT"} color={purpleFillColor} width="w-[25px]" height="h-[25px]" />
                                <p className={`text-xl font-semibold ${purpleTextColor}`}>Proceed</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}