import { BoldText } from "../../utilities/about/BoldText.tsx";
import { IndentedList } from "../../utilities/about/IndentedList.tsx";
import { MainContentText } from "../../utilities/main_content/MainContentText.tsx";

export function TechnologiesText() {
    return (
        <>
            <MainContentText>
                Swimeeter was built using a collection of front-end and back-end technologies. On the front-end, Swimeeter was built using React JS, written in primarily in TypeScript, and styled using Tailwind CSS. Swimeeter's back-end was written in Python using the Django web framework, and PostgreSQL was used for the site's database management system. A more-extensive list of the technologies used to build the site is included below.
            </MainContentText>
            <MainContentText>
                <BoldText>Front-End</BoldText>
                <IndentedList>
                    <li>
                        • Technologies: React JS, React Router, Tailwind CSS, Vite, Axios
                    </li>
                    <li>
                        • Languages: TypeScript, HTML, CSS
                    </li>
                </IndentedList>
            </MainContentText>
            <MainContentText>
                <BoldText>Back-End</BoldText>
                <IndentedList>
                    <li>
                        • Technologies: Django, Django REST Framework, PostgreSQL
                    </li>
                    <li>
                        • Languages: Python
                    </li>
                </IndentedList>
            </MainContentText>
        </>
    )
}