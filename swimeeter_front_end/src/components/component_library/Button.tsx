import './Button.css'

type color = {
    r: number,
    g: number,
    b: number
}

export function Button({handleClick, textColor, backgroundColor, text}: {
    handleClick: any, 
    textColor: color, 
    backgroundColor: color,
    text: string
}) {
    return (
        <button 
        className = 'buttonComponent'
        onClick = {handleClick} 
        style = {{
            color: `rgb(${textColor.r}, ${textColor.g}, ${textColor.b})`,
            backgroundColor: `rgb(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`
        }}>
            {text}
        </button>
    )
}
