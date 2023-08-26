import { createContext, useEffect, useState } from "react";

import { WaveSVG } from "./WaveSVG";

// * create wave context
export const WaveContext = createContext<{
    animations: boolean,
    setAnimations: React.Dispatch<boolean>
}>({
    animations: true,
    setAnimations: () => {}
});

export function WaveContainer({ size }: { size: "SMALL" | "MEDIUM" | "LARGE" }) {
    // $ retrieve SVG by size
    let waveItem: JSX.Element;
    let waveWidth: number;

    switch (size) {
        case "SMALL":
            waveItem = <WaveSVG size="SMALL" />;
            waveWidth = 200;
            break;
        case "MEDIUM":
            waveItem = <WaveSVG size="MEDIUM" />;
            waveWidth = 250;
            break;
        case "LARGE":
            waveItem = <WaveSVG size="LARGE" />;
            waveWidth = 300;
            break;
    }

    // * initialize wave state
    const [waveArray, setWaveArray] = useState<JSX.Element[]>(createWaveArray(window.innerWidth));
    const [animations, setAnimations] = useState<boolean>(true);
    
    // * define wave array creator function
    function createWaveArray(windowWidth: number) {
        const tempArray = [];
        for (let i = 0; i < Math.ceil((windowWidth + 300) / waveWidth); ++i) {
            tempArray.push(waveItem);
        }
        return tempArray;
    }

    // * define window resize listener
    useEffect(() => {
        window.addEventListener("resize", () => {
            setAnimations(false); // stops animations -> reset to beginning to avoid mismatched offset
            setWaveArray(createWaveArray(window.innerWidth));
        });
    }, []);

    return (
        <WaveContext.Provider value={{
            animations: animations,
            setAnimations: setAnimations
        }}>
            <div className="flex flex-row absolute top-0 left-0 translate-x-[-300px]">
                {waveArray}
            </div>
        </WaveContext.Provider>
    )
}