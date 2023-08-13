import { useContext, useState } from "react";

import { AppContext, UserState } from "../../../App.tsx";

import { InfoPane } from "./InfoPane.tsx";
import { InfoType } from "../helpers/formTypes.ts";
import { IconButton } from "../general/IconButton.tsx";

export function CreationFormGroup({ label, field, createInfo, optional }: {
    label: JSX.Element,
    field: JSX.Element,
    createInfo: InfoType,
    optional: boolean
}) {
    // * initialize state variables
    const [infoShown, setInfoShown] = useState<boolean>(false);

    // * initialize context
    const { userState }: { userState: UserState } = useContext(AppContext);

    return (
        <>
            <div className="flex flex-col gap-y-1">
                {infoShown &&
                    <InfoPane
                        handleXClick={(event: any) => {
                            event.preventDefault();
                            setInfoShown(false);
                        }}
                        info={createInfo}
                    />}

                <div className="flex flex-row gap-x-2 items-center w-[300px]">
                    {userState.preferences.data_entry_information &&
                        <IconButton color="primary" icon="CIRCLE_INFO" handleClick={(event: any) => {
                            event.preventDefault();
                            setInfoShown(!infoShown);
                        }}
                        />}
                    {label}
                    <div className="flex-auto"></div>
                    {optional
                        ? <p className="text-sm font-semibold underline decoration-[2px] decoration-sky-400 dark:decoration-blue-500 rounded-md text-sky-400 dark:text-blue-500">OPTIONAL</p>
                        : <p className="text-sm font-semibold underline decoration-[2px] decoration-purple-400 dark:decoration-purple-500 text-purple-400 dark:text-purple-500">REQUIRED</p>
                    }
                </div>

                {field}
            </div>
        </>
    )
}