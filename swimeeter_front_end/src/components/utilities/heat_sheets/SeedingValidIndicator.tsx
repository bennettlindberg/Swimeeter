import { IconSVG } from "../svgs/IconSVG";

// ~ component
export function SeedingValidIndicator({ valid }: { valid: boolean }) {
    // * build color scheme
    let interpretedButtonColor = "";
    let interpretedFillColor = "";  
    if (valid) {
        interpretedButtonColor = "bg-green-100 border-green-200 dark:bg-green-900 dark:border-green-800";
        interpretedFillColor = "fill-green-400 dark:fill-green-500"
    } else {
        interpretedButtonColor = "bg-red-100 border-red-200 dark:bg-red-900 dark:border-red-800";
        interpretedFillColor = "fill-red-400 dark:fill-red-500"
    }

    return (
        <>
            <button className={`flex flex-row gap-x-2 items-center p-0 w-fit h-fit rounded-full border-2 ${interpretedButtonColor}`}>
                <IconSVG icon={valid ? "CIRCLE_CHECK" : "CIRCLE_CROSS"} color={interpretedFillColor} width="w-[25px]" height="h-[25px]" />
            </button>
        </>
    )
}