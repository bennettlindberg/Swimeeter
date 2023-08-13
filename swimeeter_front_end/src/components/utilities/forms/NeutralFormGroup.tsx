import { useContext, useState } from "react";

import { AppContext, UserState } from "../../../App.tsx";

import { InfoPane } from "./InfoPane.tsx";
import { InfoType } from "../helpers/formTypes.ts";
import { IconButton } from "../general/IconButton.tsx";

export function NeutralFormGroup({ label, field, info }: {
    label: JSX.Element,
    field: JSX.Element,
    info: InfoType,
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
                        info={info}
                    />}

                <div className="flex flex-row gap-x-2 items-center w-[300px]">
                    {userState.preferences.data_entry_information &&
                        <IconButton color="primary" icon="CIRCLE_INFO" handleClick={(event: any) => {
                            event.preventDefault();
                            setInfoShown(!infoShown);
                        }}
                        />}
                    {label}
                </div>

                {field}
            </div>
        </>
    )
}