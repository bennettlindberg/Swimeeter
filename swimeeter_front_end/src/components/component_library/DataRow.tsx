import './DataRow.css';
import { ReactNode } from 'react';

export default function DataRow({ kind, children }: { kind: string, children: ReactNode }) {
    return (
        <div id="data-row-container" className={kind}>
            {children}
        </div>
    )
}
