import { IconSVG } from "../svgs/IconSVG.tsx";

// ~ component
export function PageButton({ color, handleClick, text, icon }: {
    color: "red" | "orange" | "yellow" | "green" | "purple" | "slate" | "primary",
    handleClick: (event?: any) => void,
    text?: string,
    icon?: string
}) {
    // * build color scheme
    let interpretedButtonColor = "";
    let interpretedTextColor = "";  
    let interpretedFillColor = "";  
    switch (color) {
        case "red":
            interpretedButtonColor = "bg-red-100 hover:bg-red-200 border-red-200 dark:bg-red-900 hover:dark:bg-red-800 dark:border-red-800";
            interpretedTextColor = "text-red-400 dark:text-red-500"
            interpretedFillColor = "fill-red-400 dark:fill-red-500"
            break;

        case "orange":
            interpretedButtonColor = "bg-orange-100 hover:bg-orange-200 border-orange-200 dark:bg-orange-900 hover:dark:bg-orange-800 dark:border-orange-800";
            interpretedTextColor = "text-orange-400 dark:text-orange-500"
            interpretedFillColor = "fill-orange-400 dark:fill-orange-500"
            break;

        case "yellow":
            interpretedButtonColor = "bg-yellow-100 hover:bg-yellow-200 border-yellow-200 dark:bg-yellow-900 hover:dark:bg-yellow-800 dark:border-yellow-800";
            interpretedTextColor = "text-yellow-400 dark:text-yellow-500"
            interpretedFillColor = "fill-yellow-400 dark:fill-yellow-500"
            break;

        case "green":
            interpretedButtonColor = "bg-green-100 hover:bg-green-200 border-green-200 dark:bg-green-900 hover:dark:bg-green-800 dark:border-green-800";
            interpretedTextColor = "text-green-400 dark:text-green-500"
            interpretedFillColor = "fill-green-400 dark:fill-green-500"
            break;

        case "purple":
            interpretedButtonColor = "bg-purple-100 hover:bg-purple-200 border-purple-200 dark:bg-purple-900 hover:dark:bg-purple-800 dark:border-purple-800";
            interpretedTextColor = "text-purple-400 dark:text-purple-500"
            interpretedFillColor = "fill-purple-400 dark:fill-purple-500"
            break;

        case "slate":
            interpretedButtonColor = "bg-slate-100 hover:bg-slate-200 border-slate-200 dark:bg-slate-800 hover:dark:bg-slate-700 dark:border-slate-700";
            interpretedTextColor = "text-slate-400 dark:text-slate-500"
            interpretedFillColor = "fill-slate-400 dark:fill-slate-500"
            break;

        case "primary":
            interpretedButtonColor = "bg-sky-100 hover:bg-sky-200 border-sky-200 dark:bg-blue-900 hover:dark:bg-blue-800 dark:border-blue-800";
            interpretedTextColor = "text-sky-400 dark:text-blue-500"
            interpretedFillColor = "fill-sky-400 dark:fill-blue-500"
            break;
    }

    return (
        <>
            <button className={`flex flex-row gap-x-2 items-center px-2 py-1 w-fit rounded-full border-2 ${interpretedButtonColor}`} onClick={handleClick}>
                {icon && <IconSVG icon={icon} color={interpretedFillColor} width="w-[25px]" height="h-[25px]" />}
                {text && <p className={`text-xl font-semibold ${interpretedTextColor}`}>{text}</p>}
            </button>
        </>
    )
}