import { IconSVG } from "../svgs/IconSVG";
import { DuplicateType } from "./formTypes.ts"

export function DuplicatePane({ handleClick, info }: {
    handleClick: (duplicate_handling: "unhandled" | "keep_new" | "keep_both" | "cancel") => void,
    info: DuplicateType
}) {
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
            <div className="absolute top-0 left-0 w-full h-full bg-slate-200 dark:bg-slate-800 bg-opacity-50 flex flex-col items-center justify-center">
                <div className="flex flex-row justify-center">
                    <div className={`flex flex-col gap-y-1 text-lg p-2 border-2 rounded-md w-[80%] ${textColor} ${bgColor}`}>
                        <div className="flex flex-row gap-x-2 items-center">
                            <IconSVG icon="SHIELD_EXCLAIM" color={fillColor} width="w-[35px]" height="h-[35px]" />
                            <h3 className="font-extrabold text-xl">{info.title}</h3>
                        </div>

                        <p><span className="font-semibold">Conflict: </span>{info.description}</p>

                        <div className="flex flex-row gap-x-2">
                            <button className={`flex flex-row gap-x-2 items-center px-2 py-1 w-fit rounded-full border-2 ${slateButtonColor}`} type="button" onClick={() => handleClick("cancel")}>
                                <IconSVG icon={"CIRCLE_CROSS"} color={slateFillColor} width="w-[25px]" height="h-[25px]" />
                                <p className={`text-xl font-semibold ${slateTextColor}`}>Cancel</p>
                            </button>
                            {info.keep_both &&
                                <button className={`flex flex-row gap-x-2 items-center px-2 py-1 w-fit rounded-full border-2 ${purpleButtonColor}`} type="button" onClick={() => handleClick("keep_both")}>
                                    <IconSVG icon={"CIRCLE_BOLT"} color={purpleFillColor} width="w-[25px]" height="h-[25px]" />
                                    <p className={`text-xl font-semibold ${purpleTextColor}`}>Add new and <span className="italic underline">keep</span> originals</p>
                                </button>
                            }
                            {info.keep_new &&
                                <button className={`flex flex-row gap-x-2 items-center px-2 py-1 w-fit rounded-full border-2 ${purpleButtonColor}`} type="button" onClick={() => handleClick("keep_new")}>
                                    <IconSVG icon={"CIRCLE_BOLT"} color={purpleFillColor} width="w-[25px]" height="h-[25px]" />
                                    <p className={`text-xl font-semibold ${purpleTextColor}`}>Add new and <span className="italic underline">delete</span> originals</p>
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}