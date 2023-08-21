import { useContext, useState } from "react";

import { AppContext, UserState } from "../../../App.tsx";
import { FormContext } from "../helpers/formHelpers.ts";

import { InfoPane } from "./InfoPane.tsx";
import { InfoType } from "../helpers/formTypes.ts";
import { IconButton } from "../general/IconButton.tsx";

export function EditingFormGroup({ label, field, editInfo, viewInfo, optional }: {
    label: JSX.Element,
    field: JSX.Element,
    editInfo: InfoType,
    viewInfo: InfoType,
    optional: boolean
}) {
    // * initialize state variables
    const [infoShown, setInfoShown] = useState<boolean>(false);

    // * initialize context
    const { userState }: { userState: UserState } = useContext(AppContext);
    const editMode = useContext(FormContext);

    return (
        <>
            <div className="flex flex-col gap-y-1">
                {infoShown &&
                    <InfoPane
                        handleXClick={(event: any) => {
                            event.preventDefault();
                            setInfoShown(false);
                        }}
                        info={editMode ? editInfo : viewInfo}
                    />}

                <div className="flex flex-row gap-x-2 items-center">
                    {userState.preferences.data_entry_information &&
                        <IconButton color="primary" icon="CIRCLE_INFO" handleClick={(event: any) => {
                            event.preventDefault();
                            setInfoShown(!infoShown);
                        }}
                        />}
                    {label}
                    {editMode && (
                        optional
                            ? <p className="text-sm font-semibold underline decoration-[2px] decoration-sky-400 dark:decoration-blue-500 rounded-md text-sky-400 dark:text-blue-500">OPTIONAL</p>
                            : <p className="text-sm font-semibold underline decoration-[2px] decoration-purple-400 dark:decoration-purple-500 text-purple-400 dark:text-purple-500">REQUIRED</p>
                    )}
                </div>

                {field}
            </div>
        </>
    )
}