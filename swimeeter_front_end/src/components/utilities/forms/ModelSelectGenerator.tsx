import { useEffect, useState } from "react"
import { ModelSearchSelect } from "../inputs/ModelSearchSelect.tsx"
import { FormGroup } from "./FormGroup.tsx"
import { InfoType } from "./formTypes.ts"

// ~ component
export function ModelSelectGenerator({
    idPrefix,
    type,
    label,
    info,
    placeholderText,
    defaultInfo,
    setModelSelection,
}: {
    idPrefix: string,
    type: string
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

    // * generate options based on model select type
    useEffect(() => {
        // @ make call to back-end for options data
        switch (type) {

        }
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