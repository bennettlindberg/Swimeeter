import { useContext } from "react";

import { AppContext, UserState } from "../../App";

export function WaveSVG({ size }: { size: "SMALL" | "MEDIUM" | "LARGE" }) {
    // * initialize context
    const { userState }: { userState: UserState } = useContext(AppContext);

    // $ get SVG by size
    switch (size) {
        case "SMALL":
            return (
                <svg className={userState.preferences.motion_safe ? "motion-safe:animate-translate_sm" : ""} width="200" height="8">
                    <rect className="fill-sky-400 dark:fill-blue-500" mask="url(#sm-ellipse-mask)" width="200" height="4" x="0" y="0" />
                    <ellipse className="fill-sky-400 dark:fill-blue-500" cx="150" cy="3.1" rx="50" ry="4" />
                    <defs>
                        <mask id="sm-ellipse-mask">
                            <rect fill="white" width="200" height="4" x="0" y="0" />
                            <ellipse fill="black" cx="50" cy="4.9" rx="50" ry="4" />
                        </mask>
                    </defs>
                </svg>
            )

        case "MEDIUM":
            return (
                <svg className={userState.preferences.motion_safe ? "motion-safe:animate-translate_md" : ""} width="250" height="14">
                    <rect className="fill-sky-300 dark:fill-blue-600" mask="url(#md-ellipse-mask)" width="250" height="7" x="0" y="0" />
                    <ellipse className="fill-sky-300 dark:fill-blue-600" cx="187.5" cy="5.75" rx="62.5" ry="7" />
                    <defs>
                        <mask id="md-ellipse-mask">
                            <rect fill="white" width="250" height="7" x="0" y="0" />
                            <ellipse fill="black" cx="62.5" cy="8.25" rx="62.5" ry="7" />
                        </mask>
                    </defs>
                </svg>
            )

        case "LARGE":
            return (
                <svg className={userState.preferences.motion_safe ? "motion-safe:animate-translate_lg" : ""} width="300" height="20">
                    <rect className="fill-sky-200 dark:fill-blue-700" mask="url(#lg-ellipse-mask)" width="300" height="10" x="0" y="0" />
                    <ellipse className="fill-sky-200 dark:fill-blue-700" cx="225" cy="8.5" rx="75" ry="10" />
                    <defs>
                        <mask id="lg-ellipse-mask">
                            <rect fill="white" width="300" height="10" x="0" y="0" />
                            <ellipse fill="black" cx="75" cy="11.5" rx="75" ry="10" />
                        </mask>
                    </defs>
                </svg>
            )
    }
}