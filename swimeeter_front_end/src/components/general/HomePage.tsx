import { useContext } from "react";

import { IconSVG } from "../svgs/IconSVG.tsx";
import { AppContext } from "../../App.tsx";

export function HomePage() {
    // * initialize context
    const { interpretedScreenMode }: {
        interpretedScreenMode: "light" | "dark"
    } = useContext(AppContext);

    // * calculate window height without navbar
    const windowHeight = window.innerHeight - 90;

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-y-[30px] bg-gradient-to-t from-sky-300 dark:from-blue-700" style={{height: windowHeight}}>
                <div className="flex flex-row justify-center items-center gap-x-[30px]">
                    <IconSVG icon="WATER_WAVES" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[200px]" height="h-[200px]" />
                    <h1 className="font-extrabold italic text-9xl text-black dark:text-white">
                        SWIMEETER
                    </h1>
                </div>
                <h2 className="text-black dark:text-white text-3xl text-center w-5/6">
                    An application for managing swim meets and generating heat sheets on the fly.
                </h2>
                <div className="flex flex-row justify-center gap-x-[30px]">
                    <button className="text-4xl font-semibold p-5 text-black dark:text-white rounded-md border-2 bg-sky-300 hover:bg-sky-400 border-sky-400 dark:bg-blue-700 hover:dark:bg-blue-500 dark:border-blue-500">
                        Browse swim meets
                    </button>
                    <button className="text-4xl font-semibold p-5 text-black dark:text-white rounded-md border-2 bg-sky-300 hover:bg-sky-400 border-sky-400 dark:bg-blue-700 hover:dark:bg-blue-500 dark:border-blue-500">
                        Create a meet
                    </button>
                </div>
            </div>
        </>
    )
}