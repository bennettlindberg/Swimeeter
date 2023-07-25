import { useContext } from "react";

import { AppContext, UserState } from "../../App";
import { IconSVG } from "../svgs/IconSVG";
import { WaveContainer } from "../svgs/WaveContainer";

export function NavBar() {
    // * initialize context
    const { userState }: { userState: UserState } = useContext(AppContext);

    let accountName = "GUEST";
    if (userState.logged_in) {
        accountName = "";

        if (userState.profile?.prefix !== "") {
            accountName += userState.profile?.prefix.toUpperCase() + " ";
        }

        accountName += userState.profile?.first_name.toUpperCase() + " ";

        if (userState.profile?.middle_initials !== "") {
            accountName += userState.profile?.middle_initials.toUpperCase() + " ";
        }
        
        accountName += userState.profile?.last_name.toUpperCase();

        if (userState.profile?.suffix !== "") {
            accountName += " " + userState.profile?.suffix.toUpperCase();
        }
    }
    
    return (
        <>
            <div className="fixed top-0 left-0 w-full">
                <div className="flex flex-row items-center text-white gap-x-[20px] h-[60px] w-full bg-sky-400 relative">
                    <div className="w-[0px]"></div>
                    <div className="flex flex-row items-center gap-x-[10px]">
                        <IconSVG icon="WATER_WAVES" color="fill-white" width="w-[50px]" height="h-[50px]"/>
                        <h1 className="font-extrabold italic text-4xl">SWIMEETER</h1>
                    </div>
                    <h2 className="text-2xl">HOME</h2>
                    <h2 className="text-2xl">MEETS</h2>
                    <h2 className="text-2xl">ABOUT</h2>
                    <div className="flex-auto"></div>
                    <IconSVG icon="SUN_SHINE" color="fill-white" width="w-[30px]" height="h-[40px]"/>
                    <div className="flex flex-row items-center gap-x-[5px]">
                        <h2 className="text-2xl">{accountName}</h2>
                        <IconSVG icon="ARROW_DOWN" color="fill-white" width="w-[20px]" height="h-[20px]"/>
                    </div>
                    <div className="w-[0px]"></div>
                </div>
                <div className="w-full relative">
                    <WaveContainer size="LARGE"/>
                    <WaveContainer size="MEDIUM"/>
                    <WaveContainer size="SMALL"/>
                </div>
            </div>
            <div className="h-[85px] w-full"></div>
        </>
    )
}