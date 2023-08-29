import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AppContext, NavTreeAction } from "../../../App.tsx";

import { MainPageIcon } from "../../utilities/svgs/MainPageIcon.tsx";

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
                <div className="flex flex-row justify-center items-center lg:gap-x-7 md:gap-x-6 sm:gap-x-4 gap-x-2">
                    <MainPageIcon icon="WATER_WAVES" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} />
                    <h1 className="font-extrabold italic lg:text-9xl md:text-8xl sm:text-6xl text-4xl text-black dark:text-white">
                        SWIMEETER
                    </h1>
                </div>
                <h2 className="text-black dark:text-white md:text-3xl text-2xl text-center w-5/6">
                    A tool for managing swim meets and generating heat sheets on the fly.
                </h2>
                <div className="flex flex-col md:flex-row justify-center gap-y-4 gap-x-7">
                    <button className="lg:text-4xl sm:text-3xl text-2xl font-semibold lg:p-5 sm:p-4 p-3 text-black dark:text-white rounded-md border-2 bg-sky-300 hover:bg-sky-400 border-sky-400 dark:bg-blue-700 hover:dark:bg-blue-500 dark:border-blue-500" onClick={() => navigate("/meets")}>
                        Browse swim meets
                    </button>
                    <button className="lg:text-4xl sm:text-3xl text-2xl font-semibold lg:p-5 sm:p-4 p-3 text-black dark:text-white rounded-md border-2 bg-sky-300 hover:bg-sky-400 border-sky-400 dark:bg-blue-700 hover:dark:bg-blue-500 dark:border-blue-500" onClick={() => navigate("/meets/create")}>
                        Create a meet
                    </button>
                </div>
            </div>
        </>
    )
}