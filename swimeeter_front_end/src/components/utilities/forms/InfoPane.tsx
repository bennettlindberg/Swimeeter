import { IconButton } from "../general/IconButton";
import { IconSVG } from "../svgs/IconSVG";
import { InfoType } from "./FormTypes";

export function InfoPane({ info, handleXClick }: { 
    info: InfoType, 
    handleXClick: (event: any) => void 
}) {
    const bgColor = "bg-sky-100 border-sky-200 dark:bg-blue-900 dark:border-blue-800";
    const textColor = "text-sky-400 dark:text-blue-500"
    const fillColor = "fill-sky-400 dark:fill-blue-500"

    return (
        <>
            <div className="flex flex-row gap-x-1 mt-3 items-start">
                <div className={`flex flex-col gap-y-1 text-lg p-2 border-2 rounded-md ${textColor} ${bgColor}`}>
                    <div className="flex flex-row gap-x-2 items-center">
                        <IconSVG icon="CIRCLE_INFO" color={fillColor} width="w-[35px]" height="h-[35px]" />
                        <h3 className="font-extrabold text-xl">{info.title}</h3>
                    </div>

                    <p><span className="font-semibold">Description: </span>{info.description}</p>

                    {info.common_values && <p><span className="font-semibold">Common values: </span>{info.common_values}</p>}
                    {info.permitted_values && <p><span className="font-semibold">Permitted values: </span>{info.permitted_values}</p>}
                    {info.warning && <p><span className="font-semibold text-yellow-400">WARNING: </span>{info.warning}</p>}
                
                </div>
                <IconButton color="slate" icon="CIRCLE_CROSS" handleClick={handleXClick} />
            </div>
        </>
    )
}