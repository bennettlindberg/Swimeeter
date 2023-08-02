import { IconSVG } from "../svgs/IconSVG";

export function SearchButton({handleClick}: {handleClick: () => void}) {
    const bgColor = "bg-sky-100 hover:bg-sky-200 border-sky-200 dark:bg-blue-900 hover:dark:bg-blue-800 dark:border-blue-800";
    const fillColor = "fill-sky-400 dark:fill-blue-500"
    
    return (
        <button type="button" onClick={handleClick} className={`rounded-md p-1 ${bgColor}`}>
            <IconSVG icon="EARTH_GLOBE" color={fillColor} width="w-[25px]" height="h-[25px]" />
        </button>
    )
}