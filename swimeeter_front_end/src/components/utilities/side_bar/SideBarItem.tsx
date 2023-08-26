import { IconSVG } from "../svgs/IconSVG.tsx";

// ~ component
export function SideBarItem({ icon, heading, isSelected, handleClick }: {
    icon: string,
    heading: string,
    isSelected: boolean,
    handleClick: () => void
}) {
    // * initialize context
    return (
        <>
            <button className={`group flex flex-row gap-x-2 items-center p-1 rounded-md border-2 ${isSelected ? "bg-sky-100 dark:bg-blue-900 border-sky-200 dark:border-blue-800 hover:bg-sky-200 hover:dark:bg-blue-800" : "border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 hover:dark:bg-slate-700"}`} onClick={handleClick}>
                <IconSVG icon={icon} color={isSelected ? "fill-sky-400 dark:fill-blue-500" : "fill-black dark:fill-white"} width="w-[30px]" height="h-[30px]" />
                <p className={`relative flex-auto text-left text-2xl whitespace-nowrap overflow-hidden ${isSelected ? "text-sky-400 dark:text-blue-500" : "text-black dark:text-white"}`}>
                    {heading}
                    <div className={`w-3 h-full absolute right-0 top-0 bg-gradient-to-l ${isSelected ? "from-sky-100 dark:from-blue-900 group-hover:from-sky-200 group-hover:dark:from-blue-800" : "from-slate-100 dark:from-slate-800 group-hover:from-slate-200 group-hover:dark:from-slate-700"}`}></div>
                </p>
                <IconSVG icon="ARROW_RIGHT" color={isSelected ? "fill-sky-400 dark:fill-blue-500" : "fill-black dark:fill-white"} width="w-[20px]" height="h-[20px]" />
            </button>
        </>
    )
}