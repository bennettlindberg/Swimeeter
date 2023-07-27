import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IconSVG } from "../svgs/IconSVG.tsx";
import { WaveContainer } from "../svgs/WaveContainer.tsx";
import { NavBarButton } from "./NavBarButton.tsx";
import { NavDropMenu } from "./NavDropMenu.tsx";
import { NavDropItem } from "./NavDropItem.tsx";

import { AppContext, UserState } from "../../../App.tsx";
import { UserAction } from "../../../App.tsx";

// ~ component
export function NavBar() {
    // * initialize context
    const { userState, userDispatch, interpretedScreenMode }: {
        userState: UserState,
        userDispatch: React.Dispatch<UserAction>,
        interpretedScreenMode: "light" | "dark"
    } = useContext(AppContext);

    // * initialize navigation
    const navigate = useNavigate();

    //* initialize drop down state
    const [selectedNavItem, setSelectedNavItem] = useState<"none" | "screen_mode" | "miscellaneous">("none");

    // * determine account name
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
                <div className="flex flex-row items-center text-white dark:text-black gap-x-5 h-[60px] w-full bg-sky-400 dark:bg-blue-500 relative">
                    <div className="w-[0px]"></div>

                    <div className="flex flex-row items-center gap-x-[10px]" onClick={() => navigate("/")}>
                        <IconSVG icon="WATER_WAVES" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[50px]" height="h-[50px]" />
                        <h1 className="font-extrabold italic text-4xl">SWIMEETER</h1>
                    </div>

                    <NavBarButton handleClick={() => navigate("/")}>
                        HOME
                    </NavBarButton>
                    <NavBarButton handleClick={() => navigate("/meets")}>
                        MEETS
                    </NavBarButton>
                    <NavBarButton handleClick={() => navigate("/about")}>
                        ABOUT
                    </NavBarButton>

                    <div className="flex-auto"></div>

                    <NavBarButton handleClick={() => {
                        selectedNavItem === "screen_mode"
                            ? setSelectedNavItem("none")
                            : setSelectedNavItem("screen_mode");
                    }}>
                        <div className="flex flex-row items-center gap-x-1">
                            <IconSVG icon={`${interpretedScreenMode == "dark" ? "MOON_STARS" : "SUN_SHINE"}`} color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[30px]" height="h-[30px]" />
                            <IconSVG icon="ARROW_DOWN" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[20px]" height="h-[20px]" />
                            <NavDropMenu selectedNavItem={selectedNavItem} nameForSelection="screen_mode">
                                <NavDropItem isSelected={userState.preferences.screen_mode === "system"} handleClick={() => userDispatch({
                                    type: "UPDATE_PREFERENCES",
                                    preferences: {
                                        ...userState.preferences,
                                        screen_mode: "system"
                                    }
                                })}>
                                    <IconSVG icon="COMPUTER" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    System
                                </NavDropItem>
                                <NavDropItem isSelected={userState.preferences.screen_mode === "light"} handleClick={() => userDispatch({
                                    type: "UPDATE_PREFERENCES",
                                    preferences: {
                                        ...userState.preferences,
                                        screen_mode: "light"
                                    }
                                })}>
                                    <IconSVG icon="SUN_SHINE" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    Light
                                </NavDropItem>
                                <NavDropItem isSelected={userState.preferences.screen_mode === "dark"} handleClick={() => userDispatch({
                                    type: "UPDATE_PREFERENCES",
                                    preferences: {
                                        ...userState.preferences,
                                        screen_mode: "dark"
                                    }
                                })}>
                                    <IconSVG icon="MOON_STARS" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    Dark
                                </NavDropItem>
                            </NavDropMenu>
                        </div>
                    </NavBarButton>

                    <NavBarButton handleClick={() => {
                        selectedNavItem === "miscellaneous"
                            ? setSelectedNavItem("none")
                            : setSelectedNavItem("miscellaneous");
                    }}>
                        <div className="flex flex-row items-center gap-x-1">
                            <h2 className="text-2xl">{accountName}</h2>
                            <IconSVG icon="ARROW_DOWN" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[20px]" height="h-[20px]" />
                            <NavDropMenu selectedNavItem={selectedNavItem} nameForSelection="miscellaneous">
                                {
                                    userState.logged_in
                                        ? <>
                                            <NavDropItem isSelected={false} handleClick={() => { }}>
                                                <IconSVG icon="USER_MINUS" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                                Log out
                                            </NavDropItem>
                                        </>
                                        : <>
                                            <NavDropItem isSelected={false} handleClick={() => navigate("/log_in")}>
                                                <IconSVG icon="USER_CHECK" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                                Log in
                                            </NavDropItem>
                                            <NavDropItem isSelected={false} handleClick={() => navigate("/sign_up")}>
                                                <IconSVG icon="USER_PLUS" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                                Sign up
                                            </NavDropItem>
                                        </>
                                }
                                <NavDropItem isSelected={false} handleClick={() => navigate("/settings")}>
                                    <IconSVG icon="SETTINGS" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    Settings
                                </NavDropItem>
                            </NavDropMenu>
                        </div>
                    </NavBarButton>

                    <div className="w-[0px]"></div>
                </div>

                <div className="w-full relative">
                    <WaveContainer size="LARGE" />
                    <WaveContainer size="MEDIUM" />
                    <WaveContainer size="SMALL" />
                </div>
            </div>

            <div className="h-[80px] w-full"></div>
        </>
    )
}