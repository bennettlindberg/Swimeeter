import { useEffect, useContext, useRef, useState } from "react";

import { AppContext, NavTreeAction } from "../../../App.tsx";
import { ContentPage } from "./ContentPageOLD.tsx";
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

    // * initialize state variables
    const [selectedSection, setSelectedSection] = useState<string>("overview");

    // * create scroll refs
    const overviewRef = useRef<HTMLHeadingElement>(null);
    const documentationRef = useRef<HTMLHeadingElement>(null);
    const creditsRef = useRef<HTMLHeadingElement>(null);

    const refArray = [
        {name: "overview", ref: overviewRef}, 
        {name: "documentation", ref: documentationRef},
        {name: "credits", ref: creditsRef}
    ];

    // * define main content scroll handler
    function handleScroll(event: any) {
        const scrollLocation = event.target.scrollTop;

        let minDistanceFromTop: number = Infinity;
        let minDistanceSection: string = "";

        for (const refObj of refArray) {
            const distanceFromTop = Math.abs(scrollLocation - (refObj.ref.current?.offsetTop || 0));
            if  (distanceFromTop < minDistanceFromTop) {
                minDistanceFromTop = distanceFromTop;
                minDistanceSection = refObj.name;
            }
        }

        setSelectedSection(minDistanceSection === "" ? "overview" : minDistanceSection);
    }

    return (
        <>
            <ContentPage title="About">
                <SideBar>
                    <SideBarSection>
                        <SideBarItem icon="EARTH_GLOBE" heading="Overview" isSelected={selectedSection === "overview"} handleClick={() => {overviewRef.current?.scrollIntoView({behavior: "smooth"})}} />
                        <SideBarItem icon="DOC_BOOK" heading="Documentation" isSelected={selectedSection === "documentation"} handleClick={() => {documentationRef.current?.scrollIntoView({behavior: "smooth"})}} />
                        <SideBarItem icon="TWO_USERS" heading="Credits" isSelected={selectedSection === "credits"} handleClick={() => {creditsRef.current?.scrollIntoView({behavior: "smooth"})}} />
                    </SideBarSection>
                    <SideBarSection>
                        <SideBarText>
                            Want to see Swimeeter's source code?
                        </SideBarText>
                        <PageButton icon="EARTH_GLOBE" color="primary" text="GitHub Repository" handleClick={() => { }} />
                    </SideBarSection>
                </SideBar>
                <MainContent handleScroll={handleScroll}>
                    <MainContentSection icon="EARTH_GLOBE" heading="Overview" ref={overviewRef}>
                        Hello
                        <TableGrid>
                            <colgroup>
                                <col span={1} className="w-auto" />
                                <col span={1} className="w-auto" />
                                <col span={1} className="w-auto" />
                                <col span={1} className="w-7" />
                            </colgroup>

                            <TableHeader isOpen={true} handleClick={() => console.log("clicked Header")} entries={[
                                "First Name", "Last Name", "Age"
                            ]} />
                            <TableRow handleClick={() => console.log("clicked Jane")} entries={[
                                "Jane", "Doe", "32"
                            ]} />
                            <TableRow handleClick={() => console.log("clicked Jane")} entries={[
                                "John", "Smith", "43"
                            ]} />
                        </TableGrid>
                    </MainContentSection>
                    <MainContentSection icon="DOC_BOOK" heading="Documentation" ref={documentationRef}>
                    </MainContentSection>
                    <MainContentSection icon="TWO_USERS" heading="Credits" ref={creditsRef}>
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