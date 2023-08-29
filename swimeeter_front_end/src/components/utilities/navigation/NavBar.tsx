import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { IconSVG } from "../svgs/IconSVG.tsx";
import { WaveContainer } from "../svgs/WaveContainer.tsx";
import { NavBarButton } from "./NavBarButton.tsx";
import { NavDropMenu } from "./NavDropMenu.tsx";
import { NavDropItem } from "./NavDropItem.tsx";

import { AppContext, UserState } from "../../../App.tsx";
import { UserAction } from "../../../App.tsx";
import axios from "axios";

// * define account name retriever
function getAccountName(userState: UserState) {
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
    return accountName;
}

// ~ component
export function NavBar() {
    // * initialize context, navigation, an state
    const { userState, userDispatch, interpretedScreenMode }: {
        userState: UserState,
        userDispatch: React.Dispatch<UserAction>,
        interpretedScreenMode: "light" | "dark"
    } = useContext(AppContext);
    const navigate = useNavigate();
    const [selectedNavItem, setSelectedNavItem] = useState<"none" | "screen_mode" | "miscellaneous">("none");
    const [navbarContent, setNavbarContent] = useState<JSX.Element>(<></>);
    const [reloader, setReloader] = useState<boolean>(true); // exists to force account name to reload

    // * define nav bar handlers
    function handleLostFocus(event: any, nameForSelection: string) {
        if (event.relatedTarget && event.relatedTarget.parentElement.id === nameForSelection) {
            return;
        }

        setSelectedNavItem("none");
    }

    async function handleScreenModeChange(mode: "system" | "light" | "dark") {
        // @ send preferences data to the back-end
        try {
            const response = await axios.put('/auth/update_preferences/', {
                screen_mode: mode
            });

            userDispatch({
                type: "UPDATE_PREFERENCES",
                preferences: response.data.preferences
            })
        } catch (error) {
            // ? update screen mode failed on the back-end
            navigate("errors/unknown");
        }
    }

    async function handleLogOut() {
        // @ send log out request to the back-end
        try {
            const response = await axios.post('/auth/log_out/');

            userDispatch({
                type: "LOG_OUT",
                preferences: response.data.preferences
            })

            navigate("/");
        } catch (error) {
            // ? log out failed on the back-end
            navigate("/errors/unknown");
        }
    }

    // * define window resize listener
    useEffect(() => {
        window.addEventListener("resize", () => {
            setReloader(reloader => !reloader);
        });
    }, []);

    // * reload navbar as needed
    useEffect(() => {
        const accountName = getAccountName(userState);
        setNavbarContent(getNavbarContent(window.innerWidth, accountName));
    }, [userState, interpretedScreenMode, selectedNavItem, reloader]);

    function getNavbarContent(windowWidth: number, accountName: string) {
        if (windowWidth < 400) {
            // * very small screen navbar
            return (
                <>
                    <div className="ml-3 flex flex-row items-center gap-x-[10px]" onClick={() => navigate("/")}>
                        <IconSVG icon="WATER_WAVES" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[45px]" height="h-[45px]" />
                    </div>

                    <div className="flex-auto"></div>

                    <div className="flex flex-row items-center gap-x-[10px]" onClick={() => navigate("/")}>
                        <h1 className="font-extrabold italic text-3xl">SWIMEETER</h1>
                    </div>

                    <div className="flex-auto"></div>

                    <div className="mr-1">
                        <NavBarButton handleClick={() => {
                            selectedNavItem === "miscellaneous"
                                ? setSelectedNavItem("none")
                                : setSelectedNavItem("miscellaneous");
                        }} handleBlur={(event: any) => handleLostFocus(event, "miscellaneous")}>
                            <div className="ml-5 flex flex-row items-center gap-x-1">
                                <IconSVG icon="WIDGET_MENU" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[35px]" height="h-[35px]" />
                                <NavDropMenu selectedNavItem={selectedNavItem} nameForSelection="miscellaneous">
                                    <NavDropItem isSelected={false} handleClick={() => navigate("/")}>
                                        <IconSVG icon="HOUSE" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                        Home
                                    </NavDropItem>
                                    <NavDropItem isSelected={false} handleClick={() => navigate("/meets")}>
                                        <IconSVG icon="LIBRARY" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                        Meets
                                    </NavDropItem>
                                    <NavDropItem isSelected={false} handleClick={() => navigate("/about")}>
                                        <IconSVG icon="CIRCLE_INFO" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                        About
                                    </NavDropItem>
                                    <div className="b border-t-[2px] border-black dark:border-white w-full h-[2px]"></div>
                                    <NavDropItem isSelected={false} handleClick={() => navigate("/settings")}>
                                        <IconSVG icon="SETTINGS" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                        Settings
                                    </NavDropItem>
                                    {
                                        userState.logged_in
                                            ? <>
                                                <NavDropItem isSelected={false} handleClick={handleLogOut}>
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
                                </NavDropMenu>
                            </div>
                        </NavBarButton>
                    </div>
                </>
            )
        } else if (windowWidth < 600) {
            // * small screen navbar
            return (
                <>
                    <div className="ml-3 flex flex-row items-center gap-x-[10px]" onClick={() => navigate("/")}>
                        <IconSVG icon="WATER_WAVES" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[50px]" height="h-[50px]" />
                    </div>

                    <div className="flex-auto"></div>

                    <div className="flex flex-row items-center gap-x-[10px]" onClick={() => navigate("/")}>
                        <h1 className="font-extrabold italic text-4xl">SWIMEETER</h1>
                    </div>

                    <div className="flex-auto"></div>

                    <div className="mr-1">
                        <NavBarButton handleClick={() => {
                            selectedNavItem === "miscellaneous"
                                ? setSelectedNavItem("none")
                                : setSelectedNavItem("miscellaneous");
                        }} handleBlur={(event: any) => handleLostFocus(event, "miscellaneous")}>
                            <div className="flex flex-row items-center gap-x-1">
                                <IconSVG icon="WIDGET_MENU" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[40px]" height="h-[40px]" />
                                <NavDropMenu selectedNavItem={selectedNavItem} nameForSelection="miscellaneous">
                                    <NavDropItem isSelected={false} handleClick={() => navigate("/")}>
                                        <IconSVG icon="HOUSE" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                        Home
                                    </NavDropItem>
                                    <NavDropItem isSelected={false} handleClick={() => navigate("/meets")}>
                                        <IconSVG icon="LIBRARY" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                        Meets
                                    </NavDropItem>
                                    <NavDropItem isSelected={false} handleClick={() => navigate("/about")}>
                                        <IconSVG icon="CIRCLE_INFO" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                        About
                                    </NavDropItem>
                                    <div className="b border-t-[2px] border-black dark:border-white w-full h-[2px]"></div>
                                    <NavDropItem isSelected={false} handleClick={() => navigate("/settings")}>
                                        <IconSVG icon="SETTINGS" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                        Settings
                                    </NavDropItem>
                                    {
                                        userState.logged_in
                                            ? <>
                                                <NavDropItem isSelected={false} handleClick={handleLogOut}>
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
                                </NavDropMenu>
                            </div>
                        </NavBarButton>
                    </div>
                </>
            )
        } else if (windowWidth < 850) {
            // * medium screen navbar
            return (
                <>
                    <div className="w-[0px]"></div>

                    <div className="flex flex-row items-center gap-x-[10px]" onClick={() => navigate("/")}>
                        <IconSVG icon="WATER_WAVES" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[50px]" height="h-[50px]" />
                        <h1 className="font-extrabold italic text-4xl">SWIMEETER</h1>
                    </div>

                    <div className="flex-auto"></div>

                    <NavBarButton handleClick={() => {
                        selectedNavItem === "screen_mode"
                            ? setSelectedNavItem("none")
                            : setSelectedNavItem("screen_mode");
                    }} handleBlur={(event: any) => handleLostFocus(event, "screen_mode")}>
                        <div className="flex flex-row items-center gap-x-1">
                            <IconSVG icon={`${interpretedScreenMode == "dark" ? "MOON_STARS" : "SUN_SHINE"}`} color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[30px]" height="h-[30px]" />
                            <IconSVG icon="ARROW_DOWN" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[20px]" height="h-[20px]" />
                            <NavDropMenu selectedNavItem={selectedNavItem} nameForSelection="screen_mode">
                                <NavDropItem isSelected={userState.preferences.screen_mode === "system"} handleClick={() => handleScreenModeChange("system")}>
                                    <IconSVG icon="COMPUTER" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    System
                                </NavDropItem>
                                <NavDropItem isSelected={userState.preferences.screen_mode === "light"} handleClick={() => handleScreenModeChange("light")}>
                                    <IconSVG icon="SUN_SHINE" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    Light
                                </NavDropItem>
                                <NavDropItem isSelected={userState.preferences.screen_mode === "dark"} handleClick={() => handleScreenModeChange("dark")}>
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
                    }} handleBlur={(event: any) => handleLostFocus(event, "miscellaneous")}>
                        <div className="flex flex-row items-center gap-x-1">
                            <IconSVG icon="CIRCLE_USER" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[30px]" height="h-[30px]" />
                            <IconSVG icon="ARROW_DOWN" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[20px]" height="h-[20px]" />
                            <NavDropMenu selectedNavItem={selectedNavItem} nameForSelection="miscellaneous">
                                <NavDropItem isSelected={false} handleClick={() => navigate("/")}>
                                    <IconSVG icon="HOUSE" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    Home
                                </NavDropItem>
                                <NavDropItem isSelected={false} handleClick={() => navigate("/meets")}>
                                    <IconSVG icon="LIBRARY" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    Meets
                                </NavDropItem>
                                <NavDropItem isSelected={false} handleClick={() => navigate("/about")}>
                                    <IconSVG icon="CIRCLE_INFO" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    About
                                </NavDropItem>
                                <div className="b border-t-[2px] border-black dark:border-white w-full h-[2px]"></div>
                                <NavDropItem isSelected={false} handleClick={() => navigate("/settings")}>
                                    <IconSVG icon="SETTINGS" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    Settings
                                </NavDropItem>
                                {
                                    userState.logged_in
                                        ? <>
                                            <NavDropItem isSelected={false} handleClick={handleLogOut}>
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
                            </NavDropMenu>
                        </div>
                    </NavBarButton>

                    <div className="w-[0px]"></div>
                </>
            )
        } else if (windowWidth < 1100) {
            // * large screen navbar
            return (
                <>
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
                    }} handleBlur={(event: any) => handleLostFocus(event, "screen_mode")}>
                        <div className="flex flex-row items-center gap-x-1">
                            <IconSVG icon={`${interpretedScreenMode == "dark" ? "MOON_STARS" : "SUN_SHINE"}`} color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[30px]" height="h-[30px]" />
                            <IconSVG icon="ARROW_DOWN" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[20px]" height="h-[20px]" />
                            <NavDropMenu selectedNavItem={selectedNavItem} nameForSelection="screen_mode">
                                <NavDropItem isSelected={userState.preferences.screen_mode === "system"} handleClick={() => handleScreenModeChange("system")}>
                                    <IconSVG icon="COMPUTER" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    System
                                </NavDropItem>
                                <NavDropItem isSelected={userState.preferences.screen_mode === "light"} handleClick={() => handleScreenModeChange("light")}>
                                    <IconSVG icon="SUN_SHINE" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    Light
                                </NavDropItem>
                                <NavDropItem isSelected={userState.preferences.screen_mode === "dark"} handleClick={() => handleScreenModeChange("dark")}>
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
                    }} handleBlur={(event: any) => handleLostFocus(event, "miscellaneous")}>
                        <div className="flex flex-row items-center gap-x-1">
                            <IconSVG icon="CIRCLE_USER" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[30px]" height="h-[30px]" />
                            <IconSVG icon="ARROW_DOWN" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[20px]" height="h-[20px]" />
                            <NavDropMenu selectedNavItem={selectedNavItem} nameForSelection="miscellaneous">
                                <NavDropItem isSelected={false} handleClick={() => navigate("/settings")}>
                                    <IconSVG icon="SETTINGS" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    Settings
                                </NavDropItem>
                                {
                                    userState.logged_in
                                        ? <>
                                            <NavDropItem isSelected={false} handleClick={handleLogOut}>
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
                            </NavDropMenu>
                        </div>
                    </NavBarButton>

                    <div className="w-[0px]"></div>
                </>
            )
        } else {
            // * very large screen navbar
            return (
                <>
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
                    }} handleBlur={(event: any) => handleLostFocus(event, "screen_mode")}>
                        <div className="flex flex-row items-center gap-x-1">
                            <IconSVG icon={`${interpretedScreenMode == "dark" ? "MOON_STARS" : "SUN_SHINE"}`} color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[30px]" height="h-[30px]" />
                            <IconSVG icon="ARROW_DOWN" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[20px]" height="h-[20px]" />
                            <NavDropMenu selectedNavItem={selectedNavItem} nameForSelection="screen_mode">
                                <NavDropItem isSelected={userState.preferences.screen_mode === "system"} handleClick={() => handleScreenModeChange("system")}>
                                    <IconSVG icon="COMPUTER" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    System
                                </NavDropItem>
                                <NavDropItem isSelected={userState.preferences.screen_mode === "light"} handleClick={() => handleScreenModeChange("light")}>
                                    <IconSVG icon="SUN_SHINE" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    Light
                                </NavDropItem>
                                <NavDropItem isSelected={userState.preferences.screen_mode === "dark"} handleClick={() => handleScreenModeChange("dark")}>
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
                    }} handleBlur={(event: any) => handleLostFocus(event, "miscellaneous")}>
                        <div className="flex flex-row items-center gap-x-1">
                            <h2 className="text-2xl max-w-sm overflow-hidden whitespace-nowrap">{accountName}</h2>
                            <IconSVG icon="ARROW_DOWN" color={`${interpretedScreenMode == "dark" ? "fill-black" : "fill-white"}`} width="w-[20px]" height="h-[20px]" />
                            <NavDropMenu selectedNavItem={selectedNavItem} nameForSelection="miscellaneous">
                                <NavDropItem isSelected={false} handleClick={() => navigate("/settings")}>
                                    <IconSVG icon="SETTINGS" color={`${interpretedScreenMode == "dark" ? "fill-white" : "fill-black"}`} width="w-[20px]" height="h-[20px]" />
                                    Settings
                                </NavDropItem>
                                {
                                    userState.logged_in
                                        ? <>
                                            <NavDropItem isSelected={false} handleClick={handleLogOut}>
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
                            </NavDropMenu>
                        </div>
                    </NavBarButton>

                    <div className="w-[0px]"></div>
                </>
            )
        }
    }

    return (
        <>
            <div className="fixed z-10 top-0 left-0 w-full">
                <div className="flex flex-row items-center text-white dark:text-black gap-x-5 h-[60px] w-full bg-sky-400 dark:bg-blue-500 relative">
                    {navbarContent}
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