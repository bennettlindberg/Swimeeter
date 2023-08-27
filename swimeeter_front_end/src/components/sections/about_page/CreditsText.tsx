import { AnchorLink } from "../../utilities/about/AnchorLink.tsx";
import { MainContentText } from "../../utilities/main_content/MainContentText.tsx";

export function CreditsText() {
    return (
        <>
            <MainContentText>
                Swimeeter was built by <AnchorLink href="https://github.com/bennettlindberg" text="Bennett Lindberg" />.
            </MainContentText>
            <MainContentText>
                All SVG icons used by Swimeeter were sourced from the <AnchorLink href="https://www.svgrepo.com/collection/solar-bold-icons/" text="Solar Bold Icons" /> collection, a set of SVG icons created by <AnchorLink href="https://www.figma.com/community/file/1166831539721848736?ref=svgrepo.com" text="Solar Icons" /> under the <AnchorLink href="https://creativecommons.org/licenses/by/4.0/" text="CC Attribution License" /> via <AnchorLink href="https://www.svgrepo.com/" text="SVG Repo" />.
            </MainContentText>
            <MainContentText>
                Swimeeter uses the <AnchorLink href="https://pypi.org/project/inflect/" text="inflect" /> library on the back-end for pluralization purposes. Inflect is a Python library authored by <AnchorLink href="mailto:pwdyson@yahoo.com" text="Paul Dyson" /> under the <AnchorLink href="https://opensource.org/license/mit/" text="MIT license" />.
            </MainContentText>
        </>
    )
}