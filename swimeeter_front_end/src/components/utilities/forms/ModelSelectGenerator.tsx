import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { InfoType } from "./formTypes.ts";
import { GenericModel, Pool, Session, Event, Swimmer, Team, IndividualEntry, RelayEntry } from "../models/modelTypes.ts";

import { FormGroup } from "./FormGroup.tsx";
import { ModelSearchSelect } from "../inputs/ModelSearchSelect.tsx";
import { generateEventName, generateIndividualEntryName, generateRelayEntryName, generateSwimmerName } from "../models/nameGenerators.ts";

export type ModelInfo = {
    modelName: string,
    specific_to: number,
    apiRoute: string,
    id_params: {
        meet_id: number
    }
}

// * define option text formatter
function formatOptionText(model_object: GenericModel, modelName: string) {
    switch(modelName) {
        case "POOL":
        case "SESSION":
        case "TEAM":
            return (model_object as Pool | Session | Team).fields.name

        case "SWIMMER":
            return generateSwimmerName(model_object as Swimmer);

        case "EVENT":
            return generateEventName(model_object as Event);

        case "INDIVIDUAL_ENTRY":
            return generateIndividualEntryName(model_object as IndividualEntry);

        case "RELAY_ENTRY":
            return generateRelayEntryName(model_object as RelayEntry);

        // ! should never occur
        default:
            return "";
    }
}

// ~ component
export function ModelSelectGenerator({
    idPrefix,
    modelInfo,
    label,
    info,
    placeholderText,
    defaultInfo,
    setModelSelection,
}: {
    idPrefix: string,
    modelInfo: ModelInfo
    label: JSX.Element,
    info: InfoType,
    placeholderText: string,
    defaultInfo: {
        text: string,
        model_id: number
    }
    setModelSelection: (selection: {
        text: string,
        model_id: number
    }) => void
}) {
    // * initialize state
    const [options, setOptions] = useState<{
        text: string,
        model_id: number
    }[]>([{
        text: "",
        model_id: -1
    }]);

    // * initialize navigation
    const navigate = useNavigate();

    // * generate options based on model select type
    useEffect(() => {
        async function retrieveOptions() {    
            // @ make call to back-end for options data
            try {
                const response = await axios.get(
                    modelInfo.apiRoute,
                    {
                        params: {
                            specific_to: modelInfo.specific_to,
                            ...modelInfo.id_params,
                        }
                    }
                );
    
                setOptions(response.data.map((option: GenericModel) => {
                    return {
                        text: formatOptionText(option, modelInfo.modelName),
                        model_id: option.pk
                    }
                }));
            } catch (error) {
                // ? back-end error
                navigate("/errors/unknown");
            }
        }
        retrieveOptions();
    }, []);

    return (
        <>
            <FormGroup
                label={label}
                info={info}
                field={
                    <ModelSearchSelect
                        regex={/^.*$/}
                        otherEnabled={false}
                        placeholderText={placeholderText}
                        defaultInfo={defaultInfo}
                        pixelWidth={200}
                        setModelSelection={setModelSelection}
                        idPrefix={idPrefix}
                        options={options}
                    />
                }
            />
        </>
    )
}