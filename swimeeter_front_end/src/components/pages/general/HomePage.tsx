import { useEffect, useContext } from "react";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { IconSVG } from "../../utilities/svgs/IconSVG.tsx";
import { useNavigate } from "react-router-dom";

export function HomePage() {
    // * initialize context and navigation
    const { navTreeDispatch, interpretedScreenMode, setTabTitle }: { 
        interpretedScreenMode: "light" | "dark",
        navTreeDispatch: React.Dispatch<NavTreeAction>,
        setTabTitle: (title: string) => void
    } = useContext(AppContext);
    const navigate = useNavigate();

    // * update nav tree
    useEffect(() => {
        navTreeDispatch({
            type: "UPDATE_TREE",
            data: []
        })
    }, []);

    // * update tab title
    useEffect(() => setTabTitle("Home | Swimeeter"), []);

    // * calculate window height without navbar
    const windowHeight = window.innerHeight - 80;

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-y-7 bg-gradient-to-t from-sky-300 dark:from-blue-700" style={{ height: windowHeight }}>
                <div className="flex flex-row justify-center items-center gap-x-7">
                    <IconSVG icon="WATER_WAVES" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[200px]" height="h-[200px]" />
                    <h1 className="font-extrabold italic text-9xl text-black dark:text-white">
                        SWIMEETER
                    </h1>
                </div>
                <h2 className="text-black dark:text-white text-3xl text-center w-5/6">
                    A tool for managing swim meets and generating heat sheets on the fly.
                </h2>
                <div className="flex flex-row justify-center gap-x-7">
                    <button className="text-4xl font-semibold p-5 text-black dark:text-white rounded-md border-2 bg-sky-300 hover:bg-sky-400 border-sky-400 dark:bg-blue-700 hover:dark:bg-blue-500 dark:border-blue-500" onClick={() => navigate("/meets")}>
                        Browse swim meets
                    </button>
                    <button className="text-4xl font-semibold p-5 text-black dark:text-white rounded-md border-2 bg-sky-300 hover:bg-sky-400 border-sky-400 dark:bg-blue-700 hover:dark:bg-blue-500 dark:border-blue-500" onClick={() => navigate("/meets/create")}>
                        Create a meet
                    </button>
                </div>
            </div>
        </>
    )
}