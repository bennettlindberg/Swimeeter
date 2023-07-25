import { WaveSVG } from "./WaveSVG";

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

    // * create wave array
    const waveArray = []
    for (let i = 0; i < (window.innerWidth / waveWidth) + 2; ++i) {
        waveArray.push(waveItem);
    }

    return (
        <div className="flex flex-row absolute top-0 left-0 translate-x-[-300px]">
            {waveArray}
        </div>
    )
}