import { MainContentText } from "../main_content/MainContentText";

// ~ component
export function HeatSheetText({ text }: { text: string }) {
    return (
        <tr>
            <td className="flex flex-row justify-center" colSpan={2}>
                <MainContentText>
                    <p className="text-center w-full">{text}</p>
                </MainContentText>
            </td>
        </tr>
    )
}