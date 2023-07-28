import { useEffect, useContext } from "react";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { ContentPage } from "./ContentPage.tsx";
import { PageButton } from "../../utilities/general/PageButton.tsx";

import { MainContent } from "../../utilities/main_content/MainContent.tsx";
import { MainContentSection } from "../../utilities/main_content/MainContentSection.tsx";

import { SideBar } from "../../utilities/side_bar/SideBar.tsx";
import { SideBarSection } from "../../utilities/side_bar/SideBarSection.tsx";
import { SideBarItem } from "../../utilities/side_bar/SideBarItem.tsx";
import { SideBarText } from "../../utilities/side_bar/SideBarText.tsx";

import { TableGrid } from "../../utilities/tables/TableGrid.tsx";
import { TableHeader } from "../../utilities/tables/TableHeader.tsx";
import { TableRow } from "../../utilities/tables/TableRow.tsx";
import { TableRowEntry } from "../../utilities/tables/TableRowEntry.tsx";
import { TableHeaderEntry } from "../../utilities/tables/TableHeaderEntry.tsx";

import { TextInput } from "../../utilities/inputs/TextInput.tsx";

import { TimeInput } from "../../utilities/inputs/TimeInput.tsx";
import { DurationInput } from "../../utilities/inputs/DurationInput.tsx";
import { SearchSelect } from "../../utilities/inputs/SearchSelect.tsx";
import { DateTimeInput } from "../../utilities/inputs/DateTimeInput.tsx";

// ~ component
export function AboutPage() {
    // * initialize context
    const { navTreeDispatch }: { navTreeDispatch: React.Dispatch<NavTreeAction> } = useContext(AppContext);

    // * update nav tree
    useEffect(() => {
        navTreeDispatch({
            type: "UPDATE_TREE",
            data: [
                { title: "HOME", route: "/" },
                { title: "ABOUT", route: "/about" }
            ]
        })
    });

    function formSubmit(event: Event) {
        event.preventDefault();

        const EmailField = document.getElementById("abc-email-text-field") as HTMLInputElement;
        const EmailValue = EmailField.value;

        const DayField = document.getElementById("abc-datetime-day-field") as HTMLInputElement;
        const DayValue = DayField.value;
        
        const MonthField = document.getElementById("abc-datetime-month-select-field") as HTMLInputElement;
        const MonthValue = MonthField.value;

        console.log({month: MonthValue, day: DayValue, email: EmailValue})
    }

    return (
        <>
            <ContentPage title="About">
                <SideBar>
                    <SideBarSection>
                        <SideBarItem icon="EARTH_GLOBE" heading="Overview" isSelected={true} handleClick={() => { }} />
                        <SideBarItem icon="DOC_BOOK" heading="Documentation" isSelected={false} handleClick={() => { }} />
                        <SideBarItem icon="TWO_USERS" heading="Credits" isSelected={false} handleClick={() => { }} />
                    </SideBarSection>
                    <SideBarSection>
                        <SideBarText>
                            Want to see Swimeeter's source code?
                        </SideBarText>
                        <PageButton icon="EARTH_GLOBE" color="primary" text="GitHub Repository" handleClick={() => { }} />
                    </SideBarSection>
                </SideBar>
                <MainContent>
                    <MainContentSection icon="EARTH_GLOBE" heading="Overview">
                        Hello
                        <TableGrid>
                            <colgroup>
                                <col span={1} className="w-auto" />
                                <col span={1} className="w-auto" />
                                <col span={1} className="w-auto" />
                                <col span={1} className="w-[30px]" />
                            </colgroup>

                            <TableHeader isOpen={true} handleClick={() => console.log("clicked Header")}>
                                <TableHeaderEntry>
                                    First Name
                                </TableHeaderEntry>
                                <TableHeaderEntry>
                                    Last Name
                                </TableHeaderEntry>
                                <TableHeaderEntry>
                                    Age
                                </TableHeaderEntry>
                            </TableHeader>
                            <TableRow handleClick={() => console.log("clicked Jane")}>
                                <TableRowEntry>
                                    Jane
                                </TableRowEntry>
                                <TableRowEntry>
                                    Doe
                                </TableRowEntry>
                                <TableRowEntry>
                                    32
                                </TableRowEntry>
                            </TableRow>
                            <TableRow handleClick={() => console.log("clicked John")}>
                                <TableRowEntry>
                                    John
                                </TableRowEntry>
                                <TableRowEntry>
                                    Smith
                                </TableRowEntry>
                                <TableRowEntry>
                                    43
                                </TableRowEntry>
                            </TableRow>
                        </TableGrid>
                    </MainContentSection>
                    <MainContentSection icon="DOC_BOOK" heading="Documentation">
                    </MainContentSection>
                    <MainContentSection icon="TWO_USERS" heading="Credits">
                        <form>
                            <p>Email</p>
                            <TextInput regex={/[A-Za-z]*/} placeholderText="Email" pixelWidth={300} idPrefix="abc-email" />
                            <p>Date</p>
                            <DateTimeInput idPrefix="abc-datetime" />
                            <PageButton color="primary" text="Submit" handleClick={formSubmit} />
                        </form>
                    </MainContentSection>
                </MainContent>
            </ContentPage>
        </>
    )
}