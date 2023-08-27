import { BoldText } from "../../utilities/about/BoldText.tsx";
import { IndentedList } from "../../utilities/about/IndentedList.tsx";
import { MainContentSubheading } from "../../utilities/main_content/MainContentSubheading.tsx";
import { MainContentText } from "../../utilities/main_content/MainContentText.tsx";

export function DescriptionText() {
    return (
        <>
            <MainContentSubheading subheading="Core Features" />
            <MainContentText>
                Swimeeter is a web application that streamlines the process of creating and managing large-scale swimming competitions. The site allows its users to quickly construct swim meets consisting of numerous sessions, pools, teams, events, swimmers, and entries through an intuitive interface. Additionally, Swimeeter has built-in event seeding generation, allowing users to easily sort each event's entries into competition heats and lanes.
            </MainContentText>
            <MainContentText>
                <IndentedList>
                    <li>
                        • <BoldText>Meets</BoldText> - Users begin creating their meets by adding a new meet to their Swimeeter account
                        <IndentedList>
                            <li>
                                • <BoldText>Pools</BoldText> - Each meet contains a set of pools at which meet sessions can be hosted
                                <IndentedList>
                                    <li>
                                        • <BoldText>Sessions</BoldText> - Each pool contains a set of sessions that will host competition events at the pool
                                        <IndentedList>
                                            <li>
                                                • <BoldText>Events</BoldText> - Each session contains a set of competition events in which swimmers can compete
                                            </li>
                                        </IndentedList>
                                    </li>
                                </IndentedList>
                            </li>
                            <li>
                                • <BoldText>Teams</BoldText> - Each meet contains a set of teams to which meet swimmers can belong
                                <IndentedList>
                                    <li>
                                        • <BoldText>Swimmers</BoldText> - Each team contains a set of swimmers that can participate in competition events
                                    </li>
                                </IndentedList>
                            </li>
                        </IndentedList>
                    </li>
                </IndentedList>
            </MainContentText>
            <MainContentText>
                After users have constructed the above scaffolding for their meets using the Swimeeter site, they can proceed to add entries to the meet's events. Two types of meet entries exist:
                <IndentedList>
                    <li>
                        • <BoldText>Individual entries</BoldText> - individual entries pair a single swimmer to an event
                    </li>
                    <li>
                        • <BoldText>Relay entries</BoldText> - relay entries pair a set of swimmers to an event
                    </li>
                </IndentedList>
            </MainContentText>
            <MainContentText>
                Once users have created their meet's entries, they can use Swimeeter to generate the competition seeding for the meet's events. Swimeeter's seeding generation tools allow for quick production of competition-ready heat sheets, which sort each event's entries into competition heats and pool lanes.
            </MainContentText>
            <MainContentSubheading subheading="Additional Features" />
            <MainContentText>
                <BoldText>User Accounts</BoldText>
                <IndentedList>
                    <li>
                        • Swimeeter supports authenticated user accounts that are securely stored in a back-end database. User accounts allow for data persistence, with user-constructed meets being stored for use whenever the user decides to log back into the site. Accessibility and cosmetic choices made by users are also preserved through user accounts.
                    </li>
                </IndentedList>
            </MainContentText>
            <MainContentText>
                <BoldText>Data Integrity</BoldText>
                <IndentedList>
                    <li>
                        • Extensive validation checks exist on Swimeeter's front-end and back-end to ensure that users do not accidentally delete or corrupt the data associated with their meets. Confirmation and warning pop-ups also appear on the site when users attempt potentially destructive actions or attempt to duplicate data.
                    </li>
                </IndentedList>
            </MainContentText>
            <MainContentText>
                <BoldText>Guidance</BoldText>
                <IndentedList>
                    <li>
                        • Next to most of Swimeeter's tools, settings, and forms are information buttons that guide the user as they use the site. These information buttons can be pressed to open a pop-up describing how the user shoIndentedListd interact with the target site element. Swimeeter also displays descriptive error messages when user actions go awry, steering users toward the appropriate recourse.
                    </li>
                </IndentedList>
            </MainContentText>
            <MainContentText>
                <BoldText>Customization</BoldText>
                <IndentedList>
                    <li>
                        • Next to most of Swimeeter's tools, settings, and forms are information buttons that guide the user as they use the site. These information buttons can be pressed to open a pop-up describing how the user shoIndentedListd interact with the target site element. Swimeeter also displays descriptive error messages when user actions go awry, steering users toward the appropriate recourse.
                    </li>
                </IndentedList>
            </MainContentText>
            <MainContentText>
                <BoldText>Design</BoldText>
                <IndentedList>
                    <li>
                        • Navigating around the Swimeeter site is made simple through the site's navbar and navigation tree. On larger screen sizes, the navbar displays buttons linking to the most highly-trafficked pages. Additionally, the site's horizontal navigation tree allows for quick movement within a given swim meet. Buttons are placed at the top of the site's main pages that scroll users directly to specific page sections, and Swimeeter supports a wide-range of screen sizes with its responsive design.
                    </li>
                </IndentedList>
            </MainContentText>
        </>
    )
}