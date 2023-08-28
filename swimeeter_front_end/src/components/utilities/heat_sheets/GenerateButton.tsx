import { IconSVG } from "../svgs/IconSVG.tsx";

// ~ component
export function GenerateButton({handleClick}: {handleClick: (event: any) => void}) {
    return (
        <>
            <button className={`flex flex-row gap-x-1 items-center px-1 w-fit rounded-full border-2 bg-slate-100 hover:bg-slate-200 border-slate-200 dark:bg-slate-800 hover:dark:bg-slate-700 dark:border-slate-700`} onClick={handleClick} type="button">
                <IconSVG icon="WHEEL_NUT" color="fill-slate-400 dark:fill-slate-500" width="w-[20px]" height="h-[20px]" />
                <p className={`text-lg font-semibold whitespace-nowrap text-slate-400 dark:text-slate-500`}>Generate</p>
            </button>
        </>
    )
}