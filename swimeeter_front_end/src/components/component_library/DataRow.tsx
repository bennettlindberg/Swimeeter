import './DataRow.css'

type RowEntry = {
    count: number,
    data: JSX.Element[]
}

export default function DataRow({ rowEntryData }: { rowEntryData: RowEntry }) {
    return (
        <div id="data-row-container" className={rowEntryData.count % 2 === 0 ? "even" : "odd"}>
            {...rowEntryData.data}
        </div>
    )
}
