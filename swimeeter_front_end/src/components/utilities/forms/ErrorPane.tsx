import { IconButton } from "../general/IconButton";
import { IconSVG } from "../svgs/IconSVG";
import { ErrorType } from "./FormTypes";

export function ErrorPane({ error, handleXClick }: { 
    error: ErrorType, 
    handleXClick: () => void 
}) {
    const bgColor = "bg-red-100 hover:bg-red-200 border-red-200 dark:bg-red-900 hover:dark:bg-red-800 dark:border-red-800";
    const textColor = "text-red-400 dark:text-red-500";
    const fillColor = "fill-red-400 dark:fill-red-500";

    return (
        <>
            <div className="flex flex-row gap-x-1 mt-3 items-start">
                <div className={`flex flex-col gap-y-1 text-lg p-2 border-2 rounded-md ${textColor} ${bgColor}`}>
                    <div className="flex flex-row gap-x-2 items-center">
                        <IconSVG icon="CIRCLE_EXCLAIM" color={fillColor} width="w-[35px]" height="h-[35px]" />
                        <h3 className="font-extrabold text-xl">{error.title}</h3>
                    </div>

                    <p><span className="font-semibold">Description: </span>{error.description}</p>
                    
                    {error.fields && <p><span className="font-semibold">Fields involved: </span>{error.fields}</p>}
                    {error.recommendation && <p><span className="font-semibold">Recommended action: </span>{error.recommendation}</p>}
                </div>
                <IconButton color="slate" icon="CIRCLE_CROSS" handleClick={handleXClick} />
            </div>
        </>
    )
}