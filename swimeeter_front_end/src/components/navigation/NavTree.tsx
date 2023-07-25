import { useContext } from 'react';
import { Link } from 'react-router-dom';

import type { NavTreeItem } from '../../App';
import { AppContext } from '../../App';
import { IconSVG } from '../svgs/IconSVG';

// ~ component
export function NavTree() {
    // * initialize context
    const { navTreeState }: { navTreeState: NavTreeItem[] } = useContext(AppContext);

    // * create formatted tree elements
    const formattedNavTreeItems: any[] = []
    for (const item of navTreeState) {
        // * add link
        formattedNavTreeItems.push(
            <Link to={item.route}>
                {item.title}
            </Link>
        )
        // * add arrow
        formattedNavTreeItems.push(
            <IconSVG icon="ARROW_RIGHT" color="fill-cyan-500" width="w-[50px]" height="h-[50px]"/>
        )
    }
    formattedNavTreeItems.pop() // remove extra end arrow

    return (
        <>
            <div className="flex flex-row">
                {formattedNavTreeItems}
            </div>
        </>
    )
}